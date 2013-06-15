# Jungles Frontend Helpers

## getRoot

Get the whole tree of a current node start with it's root.

```js
getRoot(tree, current)
```

```
EN
|- Products
FR
|- Products
```

If current is fr/products then it will return FR and Products.

## Navigation

```js
navigation(tree, start_level, end_level, current);
```

Instances with navigation_hide=true will be ignored.

## Markdown

```js
markdown(string)
```

## findInstancesByType

```js
findInstancesByType(tree, type)
```

## getFilename

```js
getFilename('name');
```

Because jungles-files adds a uuid in front of the filename to avoid duplicates you can extract the original filename with this helper.
