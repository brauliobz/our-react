let React = {
    createElement: (tag_or_component, props, ...children) => {
        if (typeof tag_or_component === 'function') {
            return tag_or_component(props);
        }
        const tag = tag_or_component;
        const element = {
            tag,
            props: { ...props, children }
        };

        console.log(element);

        return element;
    }
};

const App = () => (
    <div id="test" class="test_class">
        Hello
        <em>World</em>
    </div>
);

const render = (reactElementOrStringOrNumber, container) => {
    if (['string', 'number'].includes(typeof reactElementOrStringOrNumber)) {
        const textElement = document.createTextNode(String(reactElementOrStringOrNumber))
        container.appendChild(textElement);
        return;
    }

    const reactElement = reactElementOrStringOrNumber;

    const actualDomElement = document.createElement(reactElement.tag);
    if (reactElement.props) {
        Object
            .keys(reactElement.props)
            .filter(p => p !== 'children')
            .forEach(p => {
                if (p === "class") {
                    actualDomElement.className = reactElement.props[p];
                } else {
                    actualDomElement[p] = reactElement.props[p];
                }

            });

        if (reactElement.props.children) {
            reactElement.props.children.forEach(c => render(c, actualDomElement));
        }
    }

    container.appendChild(actualDomElement);
}

render(<App />, document.querySelector("#app"));