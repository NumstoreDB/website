#include <stdint.h>
#include <stdio.h>
#include <assert.h>

#include "numstore.h"

// A packed in memory representation of data
struct example
{
  float   a;
  int32_t b[5][10];
} __attribute__ ((packed));

static struct example src[200], dest[200];
static void print_example (const char *label, struct example *ex, int n);

int
main (void)
{
  // Initialize some data
  for (int i = 0; i < 200; i++)
  {
    src[i].a = i;
    for (int r = 0; r < 5; r++)
    {
      for (int c = 0; c < 10; c++)
      {
        src[i].b[r][c] = i + r * 10 + c;
      }
    }
  }

  // Open up a database
  nsdb_t *ns = nsdb_open ("sample1_crud");

  // Create a typed variable
  nsdb_execute (ns, "delete if exists example", NULL);
  nsdb_execute (ns, "create example struct { a f32, b [5][10] i32 }", NULL);

  // Insert 200 elements of seed data at offset 0
  int n = nsdb_execute (ns, "insert example 0 %d", src, 200);

  // Begin a transaction - mutations rolled back at the end
  nsdb_begin (ns);
  {
    // Read every 3rd element
    n = nsdb_execute (ns, "read example[0::3]", dest);
    print_example ("Every 3rd element", dest, n);

    // Remove every 2nd element up to len - 10
    n = nsdb_execute (ns, "remove example[0:-10:2]", dest);
    print_example ("Removed Elements [0:-10:2]", dest, n);

    // Overwrite every 2nd element with src
    nsdb_execute (ns, "write example[1::2]", src);

    // Read all
    n = nsdb_execute (ns, "read example[0:]", dest);
    print_example ("Data After Write [1::2]", dest, n);
  }
  nsdb_rollback (ns);

  // Read all after rollback
  n = nsdb_execute (ns, "read example[0:]", dest);
  print_example ("Data After Rollback", dest, n);

  return nsdb_close (ns);
}

static void
print_example (const char *label, struct example *ex, int n)
{
  assert(n >= 3);
  printf ("%s (%d):\n", label, n);
  for (int i = 0; i < 3; i++)
  {
    printf (
        "  [%d] a=%g  b=[[%d, %d ...], [%d, %d ...], ...]\n",
        i,
        ex[i].a,
        ex[i].b[0][0],
        ex[i].b[0][1],
        ex[i].b[1][0],
        ex[i].b[1][1]
    );
  }

  printf ("  ... (%d more)\n", n - 3);
}
