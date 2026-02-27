export const PYTHON_SNIPPET = `def sum_to_n(n):
    total = 0
    i = 0
    while i <= n:
        total += i
    return total

print(sum_to_n(5))
`;

export const DRILL_PROMPT =
  "This function is supposed to add all numbers from 0 up to n, but something is wrong and the program never finishes.";

export const DRILL_INSTRUCTIONS =
  "Tell the story of what this code is trying to do, where it gets stuck, and how you would change it so it actually works.";
