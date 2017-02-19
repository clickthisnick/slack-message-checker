const _ = require('lodash'),

    punctuations = ['?', '!', '.'],
    ignoredMisspellings = ['blocker', 'folder', 'invoice'],
    ignoredMisspellingWithoutS = ['asana', 'github', 'xls', 'json', 'encoded', 'shouldn\’t', 'shouldn\'t'],
    allIgnoredMisspellings = _.concat(
        _.map(ignoredMisspellings, (word) => word += 's'),
        ignoredMisspellings,
        ignoredMisspellingWithoutS
    );

let errors = [],
    warnings = [];

module.exports = {
    validate: function(document, speller) {
      // Reset Warning Global Array
        errors = [];
        warnings = [];

        const inputMsg = document.getElementById('msg').value,
            sanitizedMsg = validateLine(inputMsg, speller);

        document.getElementById('validatedMsg').innerHTML = sanitizedMsg;
        document.getElementById('errors').innerHTML = errors.join('<br>');
        document.getElementById('warnings').innerHTML = warnings.join('<br>');
    }
};

function sanitizeWord(string) {
    const punctuationless = string.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?“""”]/g, ''),
        lowerCaseWord = punctuationless.toLowerCase();

    return lowerCaseWord;
}

function spellCheck(string, speller) {
    string.split(' ').forEach((word) => {
        const sanitizedWord = sanitizeWord(word),
            spellerSuggestion = speller.correct(sanitizedWord);

        // Speller returns words in lower case
        if (!_.isNil(sanitizedWord) &&
            sanitizedWord.length !== 0 &&
            sanitizedWord !== spellerSuggestion &&
            !_.includes(allIgnoredMisspellings, sanitizedWord)
        ) {
            warnings.push(`Possibly Misspelling: ${word} -> ${sanitizedWord} -> ${spellerSuggestion}`);
        }
    });
}

function checkForDuplicateWordsInARow(sentence) {
    let previousWord;

    sentence.split(' ').forEach((word) => {
        const sanitizedWord = sanitizeWord(word);

        if (previousWord === sanitizedWord) {
            errors.push(`Duplicated Words In A Row: ${sanitizedWord}-${sanitizedWord}`);
        }
        previousWord = sanitizedWord;
    });
}

function validateLine(string, speller) {
    string = removeWhiteSpace(string);
    string = removeBadFirstWord(string);
    string = applyQuestionMark(string);

    string = simplifyPunctuation(string);
    string = omitWords(string);
    string = applySentenceAliases(string);
    string = applyWordAliases(string);

    // Final Steps
    string = _.upperFirst(string);
    string = capitalizeWords(string);
    string = applyPunctuationIfNone(string);

    // Warning Checks
    checkForRightQuestion(string);
    checkForStringInSentence(string);
    checkForDuplicateWordsInARow(string);
    spellCheck(string, speller);

    return string;
}

function applySentenceAliases(sentence) {
    const aliases = {
        'didn\’t actually': 'didn\'t',
        'didn\'t actually': 'didn\'t',
        'really should': 'should'
    };

    _(aliases).keys().forEach((alias) => {
        const re = new RegExp(alias, 'g');

        sentence = sentence.replace(re, aliases[alias]);
    });

    return sentence;
}

function removeBadFirstWord(sentence) {
    const badFirstWords = ['hey', 'so'],
        nonBayWordArray = sentence.split(' ').map((word) => {
            const sanitizedWord = sanitizeWord(word);

            return _.includes(badFirstWords, sanitizedWord) ? '' : word;
        });

    return _.join(nonBayWordArray, ' ');
}

function applyWordAliases(sentence) {
    const aliases = {
            gonna: 'going to',
            wanna: 'want to'
        },
        nonAliasedArray = sentence.split(' ').map((word) => {
            const sanitizedWord = sanitizeWord(word),
                isWordAnAlias = _.includes(_.keys(aliases), sanitizedWord);

            return isWordAnAlias ? aliases[sanitizedWord] : word;
        });

    return _.join(nonAliasedArray, ' ');

}

function removeWhiteSpace(string) {
    // // Removing multiple spaces
    string = string.replace(/  +/g, ' '); // eslint-disable-line no-regex-spaces

    // Remove leading and trailing spaces
    string = string.trim();

    return string;
}

function simplifyPunctuation(string) {
    // Get rid of ! and ?
    string = string.replace(/!!+/g, '!');
    string = string.replace(/\?\?+/g, '?');

    return string;
}

function omitWords(string) {
    const wordToOmit = ['lol', 'haha', 'hehe', 'ha'],
        sentence = string.split(' ').filter((word) => {
            const sanitizedWord = sanitizeWord(word);

            return wordToOmit.includes(sanitizedWord) ? '' : word;
        });

    return sentence.join(' ');
}

function capitalizeWords(string) {
    const wordToCapitalize = ['i', 'github', 'asana'],
        capitalizedPeopleString = string.split(' ').map((word) => {
            const sanitizedWord = sanitizeWord(word),
                isSupposedToBeCapitalized = wordToCapitalize.includes(sanitizedWord);

            return isSupposedToBeCapitalized ? _.upperFirst(word) : word;
        });

    return capitalizedPeopleString.join(' ');
}

function applyQuestionMark(string) {
    const questionPrefix = ['how', 'what', 'do', 'when', 'does', 'can', 'want'],
        linePrefix = questionPrefix.filter((prefix) => { // eslint-disable-line arrow-body-style
            return string.toLowerCase().startsWith(prefix);
        });

    if (linePrefix.length > 0) {
        string += '?';
    }
    return string;
}

function checkForRightQuestion(string) {
    if (string.toLowerCase().endsWith('right?')) {
        errors.push('Ending sentence with right? sucks. Think about how to reword it');
    }
}

// TOD change to array with phrase using the element to say the errors
function checkForStringInSentence(string) {
    const sanitizedSentence = sanitizeWord(string);

    if (sanitizedSentence.includes(' otherwise ')) {
        errors.push('Saying otherwise with a question sucks, reword it!');
    } else if (sanitizedSentence.includes('i think')) {
        errors.push('No "I think", you either know or do not know');
    } else if (sanitizedSentence.includes(' or ')) {
        errors.push('Using the word or sucks. Do not use it, reword your sentence');
    }
}

function applyPunctuationIfNone(string) {
    const punctuationUsed = punctuations.filter((punctuation) => string.endsWith(punctuation));

    if (punctuationUsed.length === 0) {
        string += '.';
    }
    return string;
}
