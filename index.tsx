let React = {
    createElement: (tagOrComponent, props, ...children) => {
        if (typeof tagOrComponent === 'function') {
            try {
                return tagOrComponent(props);
            } catch ({ promise, key }) {
                promise().then(data => {
                    promiseCache.set(key, data);
                    rerender();
                });
                return { tag: "h1", props: { children: ["I AM LOADING"] } }
            }
        }
        const tag = tagOrComponent;
        const element = {
            tag,
            props: { ...props, children }
        };

        return element;
    }
};

const states = []
let stateCursor = 0;

const useState = (initialState) => {
    const FROZEN_CURSOR = stateCursor;
    states[FROZEN_CURSOR] = states[FROZEN_CURSOR] || initialState;
    let setState = (newState) => {
        states[FROZEN_CURSOR] = newState;
        rerender();
    };

    stateCursor++;

    return [states[FROZEN_CURSOR], setState]
}

const App = () => {
    const [name, setName] = useState("person");
    const [count, setCount] = useState(0);
    const dogUrl = createResource(() => fetch("https://dog.ceo/api/breeds/image/random")
        .then(r => r.json())
        .then(payload => payload.message)
        .then(), 'dogPhoto');
    return (
        <div id="test" class="test_class">
            <p>Hello <em>{name}</em></p>
            <p>The count is {count}</p>
            <button onclick={() => setCount(count + 1)}>+</button>
            <img src={dogUrl}></img>
            <input type="text" value={name} onchange={e => setName(e.target.value)}></input>
        </div>
    );
};

const promiseCache = new Map();

const createResource = (promise, key) => {
    if (promiseCache.has(key)) {
        return promiseCache.get(key);
    }

    throw { promise, key }
}

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

const rerender = () => {
    stateCursor = 0;
    document.querySelector("#app").firstChild.remove()
    render(<App />, document.querySelector("#app"));
}

render(<App />, document.querySelector("#app"));