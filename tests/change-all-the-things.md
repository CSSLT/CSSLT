# Changing all the things

## Changing the names of _all_ properties

### Before

    @csslt {
        prop {
            content: 'padding';
        }
    }
    .test { width: 10px; height: 20px; }

### After

    .test { padding: 10px; padding: 20px; }


## Changing all the values

### Before

    @csslt {
        value {
            content: 30px;
        }
    }
    .test { width: 10px; height: 20px; overflow: hidden; }

### After

    .test { width: 30px; height: 30px; overflow: 30px; }


## Changing all the declarations

### Before

    @csslt {
        decl::content {
            display: none;
        }
    }
    .test { width: 10px; height: 20px; overflow: hidden; }

### After

    .test { display: none; display: none; display: none; }


## Changing all the selectors

### Before

    @csslt {
        selector {
            content: '.baz';
        }
    }
    .test { width: 10px; }
    .foo .bar {
        height: 10px;
    }

### After

    .baz { width: 10px; }
    .baz {
        height: 10px;
    }


## Changing all the rules

### Before

    @csslt {
        rule::content {
            .baz { margin: 10px 20px; }
        }
    }
    .test { width: 10px; }
    .foo .bar {
        height: 10px;
    }

### After

    .baz { margin: 10px 20px; }
    .baz { margin: 10px 20px; }


## Changing the root

### Before

    @csslt {
        root::content {
            .baz { margin: 10px 20px; }
        }
    }
    .test { width: 10px; }
    .foo .bar {
        height: 10px;
    }

### After

    .baz { margin: 10px 20px; }

