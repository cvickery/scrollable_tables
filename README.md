# Scrollable Tables

When you scroll a web page with a table on it, the column headings scroll out of view. Even though HTML provides _thead_ and _tbody_ elements for dividing a table into the heading and body sections, CSS does not provide a mechanism for “freezing” the heading cells while scrolling the body cells the way spreadsheets do. It can be done, but the column headings will not line up with the body columns. A second issue is to make the table responsive to changes in the vertical space allotted to the table, for example when the user opens or closes a _details_ element or resizes the viewport.

ScrollableTable is a JavaScript class to handle the column-width and vertical space issues for HTML tables with scrollable bodies.


## What’s Changed since Version 1?

The previous version waited for the web page to load, found all tables on the page with class _scrollable_, and made the adjustments to them to make their bodies scroll “properly.”
But it did not handle accessible tables, which use the _headers_ and _id_ attributes to associate body cells with their (row and) column headings; did not handle headings with multiple rows correctly, and includes bits of “superstitious” code that obscured parts of the implementation.

Version 2 retains some of the basic characteristics of Version 1 (each scrollable table has to be wrapped in a _div_ with class _table-height_, and the user has to provide code to set up event handlers for events that can change the amount of vertical space available to the table, such as window _resize_ and details _toggle_ events.

What’s new is the way in which event handlers are set up (cleaner and easier), the ability to work with multi-row headers, including those that use the _headers_ &#x2014; _id_ mechanism.

Under the hood, but visible to developers, is that the implementation uses JavaScript’s _class_ mechanism. Each scrollable table is made into an instance of the _ScrollableTable_ class.

## The Solution

The _ScrollableTable_ constructor makes the _thead_ and _tbody_ elements use the _block_ display property, which breaks the layout relationship between columns in the header and body. The `set_width()` method adjusts the column widths in the header and body to match each other, and adjusts the height of the containing div either to fill the remaining space in the viewport or to the value specified as an optional parameter to the constructor.

There is hack: there is no known way (to me) to find out when the browser has finished laying out long tables, so the initial column-width adjustment may be based on incomplete information. After a configuable delay (default is 2,000 milliseconds) the constructor re-calculates the column widths.

The code is pure DOM scripting that does not use or depend on any JavaScript library, nor will it interfere with the use of any JavaScript library. (Tested on pages that use JQuery.)

## HTML and CSS Preconditions

- Each table to be adjusted must be wrapped in another HTML element, normally a _div_, with no top/bottom borders or padding. When *ScrollableTable* adjusts the height of a table, it does so by adjusting the height of this _div_.
- The containing div must have zero margin, border, and padding. It must not be positioned. This set of constraints may possbily be violated, but the results are not guaranteed.
- Each scrollable table must include both a _thead_ and _tbody_ element. Multiple _tbody_ elements are not supported: only the first one will scroll.

## Usage
Put *scrollable_tables.js* in a known location, and load it from the page’s HTML:

```html
<script src="./scrollable_tables.js" type="module"></script>`
```
Note the `type="module"` attribute. The Javascript for the page must also be loaded using that attribute, and that code must import the ScrollableTable class. That code identifies the tables to manage and sets up the event handlers. For example:

```javascript
import ScrollableTable from './scrollable_tables.js';
window.addEventListener('load', function ()
{
  // Make the first table (if there is one) scrollable.
  const tables = document.getElementsByClassName('scrollable');
  if (tables.length > 0)
  {
    const the_table = new ScrollableTable({table: tables[0]});
    const get_height = the_table.get_height_callback();

    // Re-process the table’s height when the viewport is resized.
    window.addEventListener('resize', get_height);
    
    // Re-process the table’s height when details elements open/close.
    const details = document.getElementsByTagName('details');
    if (details)
    {
      for (let i = 0; i < details.length; i++)
      {
        details[i].addEventListener('toggle', get_height);
      }
    }
  }
});

```
### Constructor Arguments
Arguments are passed as an object. All fields are optional, although omitting the _table_ field will lead to nonsense. The other fields are:

height
: The desired height of the table, in pixels. If omitted, the height will be the number of pixels from the top of the table to the bottom of the viewport.

delay
: Number of milliseconds to wait for the table layout to complete before re-calculating column widths. Default is 2,000.

padding
: The number of pixels to add to the height of the containing _div_. This simulates bottom padding to allow room for a horizontal scrollbar and/or to make it clear that the bottom of the bottom row is visible. Default is 10 (8 for a scrollbar, 1 for a bottom border, and 1 for clarity).

> **On Callbacks**  
> Event handlers are invoked in a different context from the _onload_ event handler,
> so the `get_table_height()` method provides a copy of the instance’s `get_height()`
> method that is bound to the instance’s _this_ value.

### Using _headers_ and _id_ for column widths
In addition to making the table adhere to accessibility guidelines, using the _headers_ attribute in body cells and the _id_ attribute in header cells provides a way to handle cases where there are multiple header rows in a table. For example, here is a table that has two header rows, with the column widths determined by the first cell in the first row and the other cells in the second row:

```html
<table class="scrollable">
  <thead>
    <tr>
      <th rowspan="2" id="first-col">First</th><th colspan="3">Others</th>
    </tr>
    <tr>
      <th id="second-col">Second</th>
      <th id="third-col">Third</th>
      <th id="fourth-col">Fourth</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <th id="first-row" headers="first-row first-col">First row heading</th>
    <td headers="first-row second-col">First row, second column</td>
    <td headers="first-row third-col">First row, third column</td>
    <td headers="first-row fourth-col">First row, fourth column</td>
  </tr>
  <!-- More rows ... -->
  </tbody>
</table>
```

### Fallback for column widths
If the table does not use _headers_ and _id_ attributes, the header row with the largest number of columns, which must equal the number of columns in the first body row, will be used.

## Known Limitations
- The code assumes that the table uses the border-collapse model, and that the wider of the left and right borders of a cell is shared between adjacent columns.
- The left and right border widths have to be equal in the head and body.
- The code examines only the first row of the table body and does not support the _colspan_ attribute in that row. There have to be an equal number of header columns and body columns.
- There is no provision for separately scrolling multiple _tbody_ elements within a table.
