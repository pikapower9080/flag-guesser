import Popup from "super-simple-popup"

const content = `
<h3>What is this?</h3>
Flag guesser is an <a href="https://github.com/pikapower9080/flag-guesser" target="_blank">open source</a> vanilla javascript game about guessing world flags.
<h3>Difficulty</h3>
In an attempt to make the game fun for everyone, a difficulty option has been added. The three difficulties are described when you hover over their buttons. You might not agree with these presets, and if you have any feedback please open a <a href="https://github.com/pikapower9080/flag-guesser/issues" target="_blank">github issue</a>.
<h3>Customization</h3>
Flag guesser is extremely customizable! Below the play button you'll find a menu with many options. After the game ends, you can press the play again button to retry with the exact same options.
<h3>Bugs / Feature Requests</h3>
If you've found a bug or have an idea for a feature, please <a href="https://github.com/pikapower9080/flag-guesser/issues" target="_blank">open an issue</a> on github. You unfortunately will need to sign up for an account.
<h3>Acknowledgements</h3>
<ul>
<li>Extra special thanks to <a href="https://github.com/risan/country-flag-emoji-json" target="_blank">country-flag-emoji-json</a>, this project would not be possible without it.</li>
<li>Flag images courtesy of <a href="https://countryflagsapi.com/" target="_blank">countryflagsapi.com</a></li>
<li>Radio button styles taken from <a href="https://markheath.net/post/customize-radio-button-css" target="_blank">here</a></li>
<li>Icons by <a href="https://fontawesome.com/" target="_blank">FontAwesome</a></li>
</ul>
`

export function showAbout() {
    new Popup({
        title: 'About',
        plainText: false,
        content: content
    })
}
