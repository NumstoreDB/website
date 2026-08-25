#include <stdio.h>
#include <string.h>

// Smartfiles is a single header
#include "smartfiles.h"

static char buf[64];

int
main (void)
{
  // Open a database
  smfile_t *smf = smfile_open ("sample1_crud");
  smfile_remove (smf, NULL, 0, SMF_END);

  // Insert data at offset 0
  const char *initial = "The quick brown fox jumps over the lazy dog";
  smfile_insert (smf, initial, 0, strlen (initial));

  // Read that data (all of it)
  sb_size n = smfile_read (smf, buf, 0, SMF_END);
  printf ("after insert:  \"%.*s\"\n", (int)n, buf);

  // Execute a transaction
  smfile_begin (smf);
  {
    // Insert data at offset 34
    const char *adverb = " really";
    smfile_insert (smf, adverb, 34, strlen (adverb));

    n = smfile_read (smf, buf, 0, SMF_END);
    printf ("after insert:  \"%.*s\"\n", (int)n, buf);

    // Overwrite data at offset 16
    smfile_write (smf, "cat", 16, 3);

    n = smfile_read (smf, buf, 0, SMF_END);
    printf ("after write:   \"%.*s\"\n", (int)n, buf);

    // Remove data starting at offset
    n = smfile_remove (smf, buf, 4, 6);
    printf ("removed:       \"%.*s\"\n", (int)n, buf);

    n = smfile_read (smf, buf, 0, SMF_END);
    printf ("after remove (inside txn):  \"%.*s\"\n", (int)n, buf);
  }
  smfile_rollback (smf);

  n = smfile_read (smf, buf, 0, SMF_END);
  printf ("after rollback:  \"%.*s\"\n", (int)n, buf);

  return smfile_close (smf);
}
