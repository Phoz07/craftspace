# Obfuscated Ref ID Generation Strategy

To prevent competitive enumeration of monthly inquiry volumes and eliminate database concurrency locking, CraftSpace estimate reference codes use the format `#CS-YYMM-XXXX` where `XXXX` is a 4-character string generated from an unambiguous 30-character alphabet (`23456789ABCDEFGHJKLMNPQRSTUVWXYZ`), excluding confusing characters (0/O, 1/I/l).

## Consequences
- Yields $30^4 = 810,000$ unique permutations per calendar month with negligible collision probability.
- Short and human-friendly for customer communication over phone and LINE chat.
