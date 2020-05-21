class TodoList {
    constructor(key, element) {
        this.key = key;
        this.container = element;
        this.element = null;
        this.cache = {};

        try {
            this.render(JSON.parse(localStorage.getItem(this.key)));
        } catch (error) {
            this.render([]);
        }

        this.attach();
    }

    save() {
        localStorage.setItem(
            this.key,
            JSON.stringify(Object.entries(this.cache).map(([id, todo]) => ({
                id,
                value: todo.value.innerHTML,
                completed: todo.checkbox.checked,
            }))),
        );
    }

    attach() {
        document.addEventListener('submit', this.addTodo.bind(this));
        document.addEventListener('change', this.onChange.bind(this));
    }

    addTodo(e) {
        e.preventDefault();

        const input = e.target.querySelector('input');
        const id = Math.random().toString(36).substring(7);
        const rendered = this.renderItem({
            value: input.value,
            id,
        });

        this.cache[id] = {
            value: rendered.querySelector('[data-el="value"]'),
            checkbox: rendered.querySelector('[data-el="checkbox"]'),
        };

        this.element.insertBefore(rendered, this.element.firstElementChild);
        this.save();

        input.value = '';
    }

    onChange() {
        this.save();
    }

    renderItem(item) {
        const element = document.createElement('div');

        element.innerHTML = `
            <div class="todolist-items-item">
                <label>
                    <input data-el="checkbox" type="checkbox" name="" ${item.completed ? ' checked' : ''} value="${item.id}">
                    <span data-el="value">${item.value}</span>
                </label>
            </div>
        `;

        return element.firstElementChild;
    }

    render(items) {
        this.cache = {};

        this.element = document.createElement('div');
        this.element.className = 'todolist-items';

        items.forEach((todo) => {
            const el = this.renderItem(todo);

            this.cache[todo.id] = {
                value: el.querySelector('[data-el="value"]'),
                checkbox: el.querySelector('[data-el="checkbox"]'),
            };

            this.element.appendChild(el);
        });

        this.container.innerHTML = `
            <form id="addTodo">
                <input type="text" placeholder="Add todo">
            </form>
        `;

        this.container.appendChild(this.element);
    }
}

new TodoList('simple_todos', document.getElementById('todolist'));
