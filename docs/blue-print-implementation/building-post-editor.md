# Building Post Editor

## Current Situation

Currently, Blog post comes from local `.mdx` files in `src/content/blog` and `post.ts` reads them with Node's filesystem API and gray-matter.

## Goal

The Goal is to build Simple Source Editor for markdown file to create, edit and delete the posts using local files and folder

## Mental Mode

From Admin Page:

1. Server Component loads post data
2. Client editor manages form state
3. File repository creates/updates/deletes .mdx files
4. Public blog continues reading those same files

## Step by step (Build Order)

1. Build UI for Post Editor (build the components using form element)
2. Create Post Action and Post Schema (Validate wiht Zod)
3. Create Post File (gray-matter serialize the file)

### Building UI

Building "Markdown editor" sound like complex and use external library or package. we can use a normal element like <textarea> to begin wiht. we can use third-party library like Monaco, or another library.

**But i want to build the simple editor using normal HTML elements**

### Create Post Action and Post Schema

### Connect the form

### Create Post File
