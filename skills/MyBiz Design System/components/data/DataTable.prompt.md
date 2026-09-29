The MyBiz grid view — the product's centre of gravity. 32px rows, hairline cell dividers, first column bold.

```jsx
<DataTable columns={[{key:'name',label:'Account name',icon:'type',width:200},{key:'tier',label:'Tier',icon:'circle-dot'}]}
  rows={[{name:'Northwind', tier:<Tag color="amber">Tier 2</Tag>}]} onAddRow={fn} />
```

Row number swaps to a checkbox on hover; selected rows wash burgundy-50.
