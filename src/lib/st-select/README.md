# Select (Component)

   The select component is for use normally inside a form, you can use too outside a form like a template driven form.

## Inputs

| Property              | Type            | Req   | Description                                                                                                                               | Default |
| --------------------- | --------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| placeholder           | String          | False | The text that appears as placeholder of the select. It is empty by default                                                                | ''      |
| label                 | String          | False | Label to show over the select. It is empty by default                                                                                     | ''      |
| name                  | String          | False | Name of the select                                                                                                                        | ''      |
| qaTag                 | String          | False | Id for QA test                                                                                                                            | ''      |
| tooltip               | String          | False | The text that appears into the tooltip of select.                                                                                         | ''      |
| errors  | errorRequiredMessage          | False | This error message will appear for each case. If is empty, the status of the select will change, but the error message will not appear.   | ''      |
| isFocused             | Boolean         | False | If true, the select will be focused on view init.                                                                                         | false   |
| disabled              | Boolean         | False | If true, the select will be disabled on view init.                                                                                        | false   |
| forceValidations      | Boolean         | False | If true, the select will be validated in every change.                                                                                    | false   |
| StDropDownMenuItem    | array           | False | The list of options for de dropdown.                                                                                                      | []      |

## Example

```html
<st-select
   label="Label text"
   [options]="options"
   qaTag="qaTag-example"
   tooltip="Select option from list"
   name="option-name"
   placeholder="Placeholder"
   [errorRequiredMessage]="errorMessage"
   [forceValidations]="forceValidations"
   [(ngModel)]="model"
   reuired>
</st-select>
```

