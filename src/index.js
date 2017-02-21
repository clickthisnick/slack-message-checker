const _ = require('lodash'),

    punctuations = ['?', '!', '.'],
    ignoredMisspellings = ['blocker', 'folder', 'invoice'],
    ignoredMisspellingWithoutS = ['asana', 'github', 'xls', 'json', 'encoded', 'shouldn\’t', 'shouldn\'t'],
    allIgnoredMisspellings = _.concat(
        _.map(ignoredMisspellings, (word) => word += 's'),
        ignoredMisspellings,
        ignoredMisspellingWithoutS
    ),
    wordMap = {
        // Omit
        lol: '',
        haha: '',
        hehe: '',
        ha: '',

        // Alias
        gonna: 'going to',
        wanna: 'want to',

        // Remove Too Long
        'didn\’t actually': 'didn\'t',
        'didn\'t actually': 'didn\'t',
        'really should': 'should',

        // Capitalize
        i: 'I', // eslint-disable-line id-length
        github: 'Github',
        asana: 'Asana'
    };

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
    string = applyWordMapping(string);

    // Final Steps
    string = _.upperFirst(string);
    string = applyPunctuationIfNone(string);

    // Warning Checks
    checkForRightQuestion(string);
    checkForStringInSentence(string);
    checkForDuplicateWordsInARow(string);
    spellCheck(string, speller);

    return string;
}

function mapMiddleSentence(alias, replace, sentence) {
    const sanitizeSentence = sanitizeWord(sentence),
        index = sanitizeSentence.indexOf(` ${alias} `),
        aliasLength = index + ` ${alias} `.length;

    if (index === -1) {
        return sentence;
    }

    sentence = `${sentence.slice(0, index)} ${replace} ${sentence.slice(aliasLength)}`;

    return mapMiddleSentence(alias, replace, sentence);
}

function applyWordMapping(sentence) {
    _(wordMap).keys().sort().forEach((alias) => {

        sentence = mapMiddleSentence(alias, wordMap[alias], sentence);

        const sanitizedSentence = sanitizeWord(sentence);

        // Beginning of sentence
        if (sanitizedSentence.startsWith(`${alias} `)) {
            sentence = sentence.slice(`${alias} `.length);
            if (wordMap[alias].length > 0) {
                sentence = `${wordMap[alias]} ${sentence}`;
            }
        }

        // End of sentence
        if (sanitizedSentence.endsWith(` ${alias}`)) {

            sentence = sentence.slice(0, sentence.length - ` ${alias}`.length);
            if (wordMap[alias].length > 0) {
                sentence += ` ${wordMap[alias]}`;
            }
        }
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
    }

    if (sanitizedSentence.includes('i think')) {
        errors.push('No "I think", you either know or do not know');
    }

    if (sanitizedSentence.includes(' or ')) {
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
