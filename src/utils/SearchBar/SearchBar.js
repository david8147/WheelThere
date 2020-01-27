import Autosuggest from 'react-autosuggest';
import React, {Component} from 'react';
import * as firebase from "firebase";
import '../SearchBar/SearchBar.css';
import HashtagPages from "../../components/HashtagPage/HashtagPage.js"
import theme from './theme.css';


// Imagine you have a list of languages that you'd like to autosuggest.
// const languages = [
//     {
//         name: 'C',
//         year: 1972
//     },
//     {
//         name: 'Elm',
//         year: 2012
//     }
// ];

const languages = [];


// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
    languages.sort(compare);
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    let filteredLanguages = inputLength === 0 ? [] : languages.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );

    let languagesTop10 = [];

    for(let i = 0; i <  Math.min(5, filteredLanguages.length); i++)
        languagesTop10.push(filteredLanguages[i]);

    return languagesTop10;
};
function compare(a,b) {
    if(a===undefined || b===undefined||a.list===undefined || b.list===undefined) return 0;
    if (a.list.length < b.list.length)
        return 1;
    if (a.list.length > b.list.length)
        return -1;
    return 0;
}


// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div>
        {suggestion.name + " " + suggestion.list.length}
    </div>
);

export default class SearchBar extends Component {
    constructor() {
        super();

        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value (see below).
        // Suggestions also need to be provided to the Autosuggest,
        // and they are initially empty because the Autosuggest is closed.
        this.state = {
            value: '',
            suggestions: []
        };
    }
    componentDidMount() {
        let userRef = firebase.firestore().collection('hashtags');
        userRef.get().then((querySnapshot)=>{
            querySnapshot.forEach(function(doc) {
                let elem = {};
                elem.name = doc.id;
                elem.list = doc.data().list;
                languages.push(elem);
                // console.log(elem.name + " "+elem.list);
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.id, " => ", doc.data());
            });
        })
    }
    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };
    onSuggestionSelected= (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method })=>{
        // console.log("selected "+ JSON.stringify(suggestion))
        // suggestion: {"name":"#0","list":["Nv0O2BCQguqYKI59MJLi"]}
        // return (
        //     <HashtagPages hashtag = {suggestion.name}/>
        // )
        let s = suggestion.name.substring(1, suggestion.name.length);
        window.location.assign("/hashtags/" + s);
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Search New Trips',
            value,
            onChange: this.onChange
        };

        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionSelected = {this.onSuggestionSelected}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}
