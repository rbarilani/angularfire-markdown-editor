### Typography
---------------------

# h1 Title
## h2 Title
### h3 Title
#### h5 Title
##### h6 Title

***strong*** *Italic*

### Hypermedia
----------------------

[This is a link](http://www.darkcoding.net)

### Code
--------------

`inline code`

```
// CODE BLOCK
(function(){
    var github = function(converter) {
        return [
            {
              // strike-through
              // NOTE: showdown already replaced "~" with "~T", so we need to adjust accordingly.
              type    : 'lang',
              regex   : '(~T){2}([^~]+)(~T){2}',
              replace : function(match, prefix, content, suffix) {
                  return '<del>' + content + '</del>';
              }
            }
        ];
    };

    // Client-side export
    if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) { window.Showdown.extensions.github = github; }
    // Server-side export
    if (typeof module !== 'undefined') module.exports = github;
}());
```

### Unordered list
--------------------------

* unordered
* list
    * unordered
    * list

### Ordered list
------------------------

1. ordered
2. list
    1. ordered list
    2. list