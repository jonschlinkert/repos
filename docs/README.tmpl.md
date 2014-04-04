# {%= name %} {%= badge("fury") %}

> {%= description %}

Once installed, just run `repos [username]`, and a JSON file with the specified user's GitHub repositories will be saved in the current working directory.

## Install
Install globally with [npm](npmjs.org):

```bash
npm i -g repos
```

## Usage

 * List repos for a user: `repos USERNAME [args]`
 * List repos for an org: `repos -o ORG-NAME [args]`

General options:

* `-h`|`--help`: Print options and usage information.
* `-u`|`--user`: List repos for the specified GitHub username.
* `-o`|`--org`: List repos for the specified GitHub org.
* `-d`|`--dest`: The destination file. Default is `repos.json`

## Author
{%= contrib("jon") %}

## License
{%= copyright() %}
{%= license() %}

***

{%= include("footer") %}