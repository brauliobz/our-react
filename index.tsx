let React = {
    createElement: (tag, props, ...children) => {
        const element = {
            tag,
            props: { ...props, children }
        };

        console.log(element);

        return element;
    }
};

const a = (
    <div class="test">
        Hello
        <em>World</em>
    </div>
);
