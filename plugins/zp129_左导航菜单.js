import React from "react"

function render(ref) {
    let arr = ref.props.arr || ref.props.static
    if (!Array.isArray(arr)) arr = ARR
    if (!ref.cur) match(ref, arr)
    return <ol>{arr.map((a, i) => rLI(ref, a, i, 1) )}</ol>
}

function rLI(ref, a, i, L) {
    if (typeof a === "string") return <li onClick={e => select(ref, e, a, i)} key={i}>
        <a className={ref.cur === a ? "cur" : ""}>{a}</a>
    </li>
    if (a.children) return <li onClick={e => open(ref, e, a)} className={ref.open.includes(a.title) ? "open" : ""} key={i}>
        <div><span>{a.title}</span><i></i></div>
        <ol className={(ref.open.includes(a.title) ? "" : "zhide ") + "L" + L}>{a.children.map((a, i) => rLI(ref, a, i, L + 1) )}</ol>
    </li>
    let r = { children: a.title }
    if (ref.cur === a.title) r.className = "cur"
    if (a.link) window.top === window.self ? r.href = a.link : r.onClick = e => ref.exc('go(link)', { link: a.link })
    return <li onClick={e => select(ref, e, a.title, i)} key={i}><a {...r}/></li>
}

function match(ref, arr) {
    arr.forEach(a => {
        if (a.link && location.pathname.endsWith(a.link)) ref.cur = a.title
        if (!ref.cur && a.children) match(ref, a.children)
    })
}

function open(ref, e, a) {
    e.stopPropagation()
    ref.open.includes(a.title) ? ref.open.splice(ref.open.indexOf(a.title), 1) : ref.open.push(a.title)
    ref.render()
}

function select(ref, e, $x, $index) {
    e.stopPropagation()
    ref.cur = $x
    if (ref.props.onClick) ref.exc(ref.props.onClick, { ...ref.ctx, $x, $index }, () => ref.exc("render()"))
}

function init(ref) {
    ref.open = []
    setTimeout(() => {
        const cur = ref.container.querySelector(".cur")
        if (cur) openParent(cur)
    })
}

function openParent(el) {
    if (el && el.classList.contains("zhide")) el.classList.remove("zhide")
    if (!el.classList.contains("zp129")) openParent(el.parentElement)
}

const css = `
.zp129 {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 100vh;
    overflow: auto;
    border-right: 1px solid rgb(232, 232, 232);
    transition: left 0.3s ease 0s;
}
.zp129 ol {
    list-style: none;
    margin: 0;
    padding: 5px 0;
    box-sizing: border-box;
    transition: background 0.3s, width 0.2s;
}
.zp129 ol::before,
.zp129 ol::after {
    display: table;
    content: '';
}
.zp129 ol::after {
    clear: both;
}
.zp129 div {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 2.5;
    position: relative;
    display: block;
    padding: 0 20px;
    white-space: nowrap;
    cursor: pointer;
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
}
.zp129 .cur div {
    color: #1890ff;
}
.zp129 svg {
    margin-right: 10px;
}
.zp129 i {
    position: absolute;
    top: 50%;
    right: 16px;
    width: 10px;
    transition: transform .3s cubic-bezier(.645, .045, .355, 1);
}
.zp129 i::before,
.zp129 i::after {
    position: absolute;
    width: 6px;
    height: 1.5px;
    background: #fff;
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65));
    border-radius: 2px;
    transform: rotate(-45deg) translateX(2px);
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
    content: '';
}
.zp129 i::after {
    transform: rotate(45deg) translateX(-2px);
}
.zp129 .open > div > i::before {
    transform: rotate(45deg) translateX(2px);
}
.zp129 .open > div > i::after {
    transform: rotate(-45deg) translateX(-2px);
}
.zp129 a {
    line-height: 2.5;
    position: relative;
    display: block;
    padding: 0 20px;
    white-space: nowrap;
    cursor: pointer;
    color: inherit;
    transition: all .3s cubic-bezier(.645, .045, .355, 1);
}
.zp129 a.cur {
    color: #1890ff;
    background-color: #e6f7ff;
}
.zp129 a::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    border-right: 2px solid #1890ff;
    transform: scaleY(.0001);
    opacity: 0;
    transition: all 0.15s cubic-bezier(0.215, 0.61, 0.355, 1);
    content: '';
}
.zp129 a.cur::after {
    opacity: 1;
    transform: scaleY(1);
}
.zp129 div:hover i::before,
.zp129 div:hover i::after {
    background: linear-gradient(to right, #1890ff, #1890ff);
}
.zp129 div:hover,
.zp129 a:hover {
    color: #1890ff;
}
.zp129 .L1 div,
.zp129 .L1 a {
    padding-left: 48px;
}
.zp129 .L2 div,
.zp129 .L2 a {
    padding-left: 76px;
}
.zp129 .L3 div,
.zp129 .L3 a {
    padding-left: 104px;
}
`

$plugin({
    id: "zp129",
    props: [{
        prop: "arr",
        type: "text",
        label: "数组表达式",
        ph: "需在数据组件内，使用括弧，优先于静态数组"
    }, {
        prop: "static",
        type: "json",
        label: "静态数组"
    }, {
        prop: "onClick",
        type: "exp",
        label: "onClick"
    }],
    render,
    init,
    css
})

const ARR = [
    "一级菜单 A",
    "一级菜单 B",
    {
        title: "二级菜单",
        children: [{
                title: "无链接 1"
            },
            {
                title: "有链接 1",
                link: "link01"
            },
            {
                title: "二级链接 1",
                link: location.pathname
            }
        ]
    },
    {
        title: "三级菜单",
        children: [{
                title: "无链接 2"
            },
            {
                title: "还有子菜单",
                children: [{
                        title: "无链接 3"
                    },
                    {
                        title: "三级链接 3",
                        link: location.pathname
                    }
                ]
            },
            {
                title: "二级链接 2",
                link: "link02"
            }
        ]
    }
]