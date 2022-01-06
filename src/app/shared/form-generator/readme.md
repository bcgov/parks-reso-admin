# Form Generator

This is a component that allows us to use JSON to generate a form. This is currently being used for search filters.

## Input

The markup for this code is as follows:

```
<app-form-generator
    [loadingStatus]="loadingSearch"
    [formComponents]="formComponents"
    (submitEvent)="filterPasses($event)">
</app-form-generator>
```

### loadingStatus

This is a boolean that sets the form generator into a state of loading. This will disable the search button.

### formComponents

This is an array that contains the information to generate your form. There are currently 4 types of fields: select, date, autoMultiSelect and text.

Here is an example:

```
  public formComponents = [
    {
      formType: 'select',
      label: 'Pass Type',
      value: 'passType',
      options: []
    },
    {
      formType: 'date',
      label: 'Date',
      value: 'date',
      // Default to today's date on page load
      initialValue: new Date()
    },
    {
      formType: 'autoMultiSelect',
      label: 'Pass Status',
      value: 'passStatus',
      multiSelectOptions: this.passMultiSelectOptions
    },
    {
      formType: 'text',
      label: 'First Name',
      value: 'firstName',
      initialValue: undefined
    },
    {
      formType: 'text',
      label: 'Last Name',
      value: 'lastName',
      initialValue: undefined
    },
    {
      formType: 'text',
      label: 'Email',
      value: 'email',
      initialValue: undefined
    },
    {
      formType: 'text',
      label: 'Reservation Number',
      value: 'reservationNumber',
      initialValue: undefined
    }
  ];
```

passMultiSelectOptions looks like this:

```
  public passMultiSelectOptions = new FilterObject(
    'passStatus',
    FilterType.MultiSelect,
    'Pass Status',
    new MultiSelectDefinition(['active', 'reserved', 'cancelled', 'expired'])
  );
```

Multiselect related imports are as follows:

```
import {
  FilterObject,
  FilterType,
  MultiSelectDefinition
} from 'app/shared/components/search-filter-template/filter-object';
```

### submitEvent

This is an output that will emmit parameters when the search button is clicked.

# Todo

We should be able to pass parameters to dictate how large each entry is. This can be done by utilizing bootstrap grids.
