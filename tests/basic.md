# Basic CSSLT tests

## Empty Wrapper

### Before

    @csslt {}
    .test { width: 10px; }

### After

    .test { width: 10px; }


## Wrapper with comments

### Before

    @csslt {
        /* Your CSSLT code there */
    }
    .test { width: 10px; }

### After

    .test { width: 10px; }


## Wrapper with some CSS code

### Before

    @csslt {
        .foo {
            bar: baz;
        }
    }
    .test { width: 10px; }

### After

    .test { width: 10px; }
