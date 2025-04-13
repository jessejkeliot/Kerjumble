interface Question {
    word: string;
    definition: string;
    shuffledDefinitions: string[];
    type: ("verb" | "adjective" | "noun" | "adverb");
}