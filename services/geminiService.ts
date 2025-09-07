
import type { Quote } from '../types';
import localQuotes from '../quotes.json';

/**
 * The main function to get a hopeful quote.
 * It can optionally receive the current quote to ensure a new one is returned.
 * @param currentQuote - The quote currently displayed to the user.
 * @returns A promise that resolves to a Quote object.
 */
export async function generateHopefulQuote(currentQuote?: Quote): Promise<Quote> {
    // If quotes failed to load or the file is empty, provide a hardcoded fallback.
    if (!localQuotes || localQuotes.length === 0) {
        return { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" };
    }

    // If there's only one quote, just return it.
    if (localQuotes.length === 1) {
        return localQuotes[0];
    }

    let nextQuote: Quote;
    
    // Try to find a different quote from the current one.
    do {
        const randomIndex = Math.floor(Math.random() * localQuotes.length);
        nextQuote = localQuotes[randomIndex];
    } while (currentQuote && nextQuote.quote === currentQuote.quote);

    return nextQuote;
}