module.exports = function Section(props) {
    const { title, content } = props;
    return (
        <section style={{ width: 100, maxHeight: '200px' }}>
            <h1 id="head">{title}</h1>
            <p>{content}</p>
        </section>
    );
}

