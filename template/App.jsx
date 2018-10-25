const Section = require('./Section');

module.exports = function App(props) {
    return <Section title="Hello" content={props.name || 'World'} />;
}

