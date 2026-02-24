export type Suggestion = {
  label: string;
  href: string;
  kind: "results" | "category" | "city" | "provider" | "help";
};

export function getSuggestions(_input: string): Suggestion[] {
  return [
    {
      label: "npr. muzika Sarajevo ili fotograf Banjaluka",
      href: "#",
      kind: "help",
    },
  ];
}
