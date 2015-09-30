# CSSLT

## Abstract

The goal of CSSLT is to provide a way to change your CSS using CSS inside your CSS.

## Use cases

1. CSS beautifiers
2. CSS Linters
3. CSS Tools
4. CSS documentations?
5. CSS ???

## The form

Right now CSSLT is a meta-language based on CSS and implemented using PostCSS. That means that it is CSS-syntax compliant (at least, mostly), you can use any tools for handling CSS to work on CSSLT documents, like generate them using preprocessors, or even modify CSSLT documents using CSSLT itself.

## The syntax

Everything starts with a custom at-rule.

```
@csslt {
    /* Your CSSLT code there */
}
```

Everything inside that rule is a CSSLT stylesheet that would be applied to all the other CSS in that document that can be placed outside of that at-rule.

**Note:** There would be other possible ways to include and use CSSLT stylesheet, but for now let's say we're using this one.

The CSSLT code inside that at-rule can look like this:

```
@csslt {
    decl:has(prop[name=padding-x])::content {
        padding-left: content-of('value');
        padding-right: content-of('value');
    }
}
```

**Note:** In that example we're showing the `@csslt` at-rule, in the below examples it would be omited unless used alongside actual CSS.

Does that look like CSS _a bit_? You can spot that this piece of code looks like a CSS rule, with a selector containing unknown element, then a block with declarations that look just like your usual CSS declarations but with some extra strange stuff inside.

Now, what this piece of code does: it selects all _declarations_ that have a _property_ inside of them with the _name_ of `padding-x`, then it sets the _content_ of this declaration to be two other declarations: `padding-left` and `padding-right`, each of those having a _content of_ the initial declarations' _value_.

That means that when this CSSLT is applied to a CSS containing

```
.foo {
    padding-x: 10px;
}
```

if would be transformed to

```
.foo {
    padding-left: 10px;
    padding-right: 10px;
}
```

That's the basic example of what CSSLT is capable of. Right now it can seem to be a little too much for doing too little and comparable with stuff like mixins in preprocessors. However, the main point of CSSLT is that it is a _declarative_ language. That means that you can _override_ stuff using more specific selectors just like you can do this at CSS.

### Available nodes

When writing CSSLT you're working not just with CSS, but with its AST with all the stuff exposed, so you could override not only rules, declarations and similar stuff, but also override things like the whitespace symbols between entities and other code style thingies.

Right now CSSLT is based on the PostCSS' AST, and the names of the nodes correspond to the node and property names in PostCSS' AST.

There are following basic nodes available at the moment (in the approximate way they could nest)

- `root` — the root node of the document, contains:
    - `rule` — the whole rule node;
        - `selector` — the whole selector of the rule;
        - `decl` — a single declaration inside the rule;
            - `prop` — the declaration's property name;
            - `value` — the whole declaration's value.


// TODO: subnodes etc.
// TODO: future nodes that are nonexistant in PostCSS AST.

## Implementation


## AST as a DOM node tree

After PostCSS we have an AST: https://sneakertack.github.io/postcss-playground/

Then we have a pseudo-DOM with nodes.

Each node represents an entity in AST.

- `root` — node with `"type": "root"`
- `rule` — node with `"type": "rule"`
- `selector` — property `selector` of a `rule`
- `decl` — node with `"type": "decl"`
- `prop` — property `prop` of a `decl`
- `value` — property `value` of a `decl`

etc.

Most nodes could have subnodes, like `selector` could have multiple subselectors (or is there a better term?) inside, with simple selectors and combinators and other stuff inside.

Property could have prefix and property-name.

Value could have a loooot of stuff inside.

Also: media queries, other at-rules and other stuff.

You can imaging this as if this was a DOM like this:

```
<root>
    <rule>
        <selector></selector>
        <decls>
            <decl>
                <prop></prop>
                <value></value>
            </decl>
        </decls>
    </rule>
</root>
```

The main point is everything that can become more complex becomes an element.

Actually, everything else, even stuff like `after`, like `semicolon` and all other similar nodes (that in no possible future could become “elements”) become elements too. This would make it easier to work with them in the same manner.

```
<decl>
    <before>: </before>
    <between>\n  </between>
</decl>
```

etc.

### Values as attributes as well

In a lot of cases we'd like to get the content of the nodes in selectors, for this we could duplicate the values as attributes:

```
<decl>
    <before value=": ">: </before>
    <between value="\n  ">\n  </between>
    <prop value="padding">padding</prop>
    <value value="10px 20px">10px 20px</value>
</decl>
```

The `value` attribute would work like `.text()`, you'll get the literal textual equiv there as if there were not nested nodes.


## CSS for this

Now have this pseudo-DOM (wait. What if create an _actual_ DOM out of this and then work with it? The only problem is that DOM is expensive, or is it?)

We can “style” in by targeting nodes and doing stuff in a CSS manner.

```
decl > between {
    content: "    \n";
}
```

here we are setting the same between declarations to four spaces and a newline.

```
rule rule decl > between {
    content: "        \n";
}
```

Here we set the indent to 8 spaces when we're inside two rules.

And it is the place where we could introduce some functions like `nesting-level()` that could be used to set the proper amount of spaces without the need of redefining each and every nesting level in selectors.

```
decl > between {
    content: nesting-level("    ") "\n";
}
```

(maybe this could be `nesting-level * "    "`, or `calc(nesting-level * "    ")`, it's a syntax issue that could be solved later).

When we need to check if there is something inside of a node , but target the node itself, the `:has()` from selectors L4 would help us.

### Adding/replacing nodes

There could be a lot cases where we'd like to add more nodes or remove/replace our nodes with something else.

For this we could use CSS-like pseudo-elements like `:after` and `:content` in a way that everything that goes inside of them is treated just like normal CSS.

`:after` and `:before` should insert proper nodes after/before the target, `:content` should rewrite the current node.

I guess not all nodes could get `:before` and `:after`, however we could fallback to the closest node that fits? Like when we insert something after `selector` it is inserted after the rule or the last declaration? We should clarify this.

The easiest example can be like that:

```
decl:has(prop[value=padding-x])::content {
    padding-left: content-of('value');
    padding-right: content-of('value');
}
```

Here we're getting a `padding-x` property and replacing it with two other properties where for the values we're getting the `value` node of the given node.

The syntax for the getter could change though of course, maybe we would have the namespaces everywhere for this, dunno.

…

Actually, we can introduce the backwards-going pseudoclasses for stuff like that so the selector could be written better:

```
prop[value=padding-x]::decl::content {
    padding-left: content-of('::value');
    padding-right: content-of('::value');
}
```

Here we're having a `::decl` pseudo for `prop` and `::value` as a prop's pseudo for value.


### Shortcuts

Right now there are no things like classes and IDs. We could introduce something like that for easier targeting, but which?

Also, should we make stuff like `prop[value=padding-x]` which could be both as subject and inside `:has()` to be also a pseudo? Like `::prop(padding-x)`? What should it target? Can it be without target?

And should those shortcuts somehow be described as csstcss too?

Like

```
pseudo-element[value=prop] {
    content: "prop[" value-of("content") "]";
}
```

Or something like that?

Anyway, that's the second possible layer, we just need to implement the first one for the starters.


## Stages and order of appliance

It seems that like at CSSComb we'll need to determine which rules are applied before others etc. We could create “Stages”, and then later place all the rules inside those stages, so we could have a nice way of setting the order of stuff.

Or, another possibility, to do just like CSS is working: have all the rules parsed, then for every node search for a rule etc.

That would mean that there would be an actual difference between `decl:has(prop[value=padding-x])::content` and `prop[value=padding-x]::decl::content`, as they would be applied at different places (one — at the iteration through decls, another — at the iteration through props).

However, we could have both, why not.

And having both would mean we could _apply_ both in some times. Here we'll need to find out how to add more stuff from different rules, so there won't be overrides, like having ::after(1) etc from the old selectors spec?

// Anyway, this seems like a nice task for getting to know CSS better — as it would be an actual implementation of how CSS matches and works lol.

* * *

Should we use virtual DOM or something like that? Or we should make our own selector mathing engine?