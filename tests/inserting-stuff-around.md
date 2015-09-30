# Inserting stuff around

## Insert a new decl after all props

### Before

    @csslt {
        prop::after {
            display: none;
        }
    }
    .test { width: 10px; height: 20px; }

### After

    .test { width: 10px; display: none; height: 20px; display: none; }


## Insert a new decl before all props

### Before

    @csslt {
        prop::before {
            display: none;
        }
    }
    .test { width: 10px; height: 20px; }

### After

    .test { display: none; width: 10px; display: none; height: 20px; }


## Insert a new value after each one

### Before

    @csslt {
        value::after {
            content: 30px;
        }
    }
    .test { width: 10px; padding: 15px 20px; overflow: hidden; }

### After

    .test { width: 10px 30px; padding: 15px 20px 30px; overflow: hidden 30px; }


## Insert a new value before each one

### Before

    @csslt {
        value::before {
            content: 30px;
        }
    }
    .test { width: 10px; padding: 15px 20px; overflow: hidden; }

### After

    .test { width: 30px 10px; padding: 30px 15px 20px; overflow: 30px hidden; }


## Inserting a new declaration after a given one

### Before

    @csslt {
        decl::after {
            border: none;
        }
    }
    .test { width: 10px; height: 20px; overflow: hidden; }

### After

    .test { width: 10px; border: none; height: 20px; border: none; overflow: hidden; border: none; }


## Inserting a new declaration before a given one

### Before

    @csslt {
        decl::before {
            border: none;
        }
    }
    .test { width: 10px; height: 20px; overflow: hidden; }

### After

    .test { border: none; width: 10px; border: none; height: 20px; border: none; overflow: hidden; }


## Inserting a declaration after each rule

### Before

    @csslt {
        rule::after {
            margin: 10px 20px;
        }
    }
    .test { width: 10px; height: 20px; }
    .foo .bar {
        height: 10px;
    }

### After

    .test { width: 10px; height: 20px; margin: 10px 20px; }
    .foo .bar {
        height: 10px;
        margin: 10px 20px;
    }

## Inserting a declaration before each rule

### Before

    @csslt {
        rule::before {
            margin: 10px 20px;
        }
    }
    .test { width: 10px; height: 20px; }
    .foo .bar {
        height: 10px;
    }

### After

    .test { margin: 10px 20px; width: 10px; height: 20px; }
    .foo .bar {
        margin: 10px 20px;
        height: 10px;
    }


## Inserting a rule after each rule

### Before

    @csslt {
        rule::after {
            .baz { margin: 10px 20px; }
        }
    }
    .test { width: 10px; height: 20px; }
    .foo .bar {
        height: 10px;
    }

### After

    .test { width: 10px; height: 20px; }
    .baz { margin: 10px 20px; }
    .foo .bar {
        height: 10px;
    }
    .baz { margin: 10px 20px; }


## Inserting a rule before each rule

### Before

    @csslt {
        rule::before {
            .baz { margin: 10px 20px; }
        }
    }
    .test { width: 10px; height: 20px; }
    .foo .bar {
        height: 10px;
    }

### After

    .baz { margin: 10px 20px; }
    .test { width: 10px; height: 20px; }
    .baz { margin: 10px 20px; }
    .foo .bar {
        height: 10px;
    }


## Injecting a rule after the root

### Before

    @csslt {
        root::after {
            .baz { margin: 10px 20px; }
        }
    }
    .test { width: 10px; }
    .foo .bar {
        height: 10px;
    }

### After

    .test { width: 10px; }
    .foo .bar {
        height: 10px;
    }
    .baz { margin: 10px 20px; }


## Injecting a rule before the root

### Before

    @csslt {
        root::before {
            .baz { margin: 10px 20px; }
        }
    }
    .test { width: 10px; }
    .foo .bar {
        height: 10px;
    }

### After

    .baz { margin: 10px 20px; }
    .test { width: 10px; }
    .foo .bar {
        height: 10px;
    }
