
export function getFlagEmoji(countryCode: string): string {
    const upperCode = countryCode.toUpperCase();

    return String.fromCodePoint(...upperCode.split('')
        .map(letter => 0x1F1E6 - 65 + letter.charCodeAt(0)));
}