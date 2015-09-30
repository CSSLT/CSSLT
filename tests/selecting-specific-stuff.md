# Changing all the things

## Changing the names of specific props

### Change the name that is strict equal

#### Before

    @csslt {
        prop[name=padding] {
            content: 'margin';
        }
    }
    .test { padding: 10px; height: 20px; padding-left: 15px; }

#### After

    .test { margin: 10px; height: 20px; padding-left: 15px; }


### Change the name that matches the beginning of name

#### Before

    @csslt {
        prop[name^=padding] {
            content: 'margin';
        }
    }
    .test { padding: 10px; height: 20px; padding-left: 15px; }

#### After

    .test { margin: 10px; height: 20px; margin: 15px; }
