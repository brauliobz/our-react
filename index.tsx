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
