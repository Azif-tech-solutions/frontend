Modal for focused, interrupting tasks (create, rename, confirm destructive).

```jsx
<Dialog title="Create workspace" onClose={fn} footer={<><Button variant="ghost">Cancel</Button><Button>Create</Button></>}>
  <Input label="Name" />
</Dialog>
```
