# Obsolete ... Do Not Use This Project!
At the time I developed this project, I could not find a way to “freeze" column headers in HTML tables.
But in fact, all modern browsers support the CSS `sticky` value for the `position` property of `thead` elements. For example, this piece of CSS will cause `thead` elements to remain in position at the top of the viewport when scrolling a table that is too tall to fit in the viewport:

```
thead {
  position: sticky;
  top: 0;
  }
```
No JavaScript needed at all! The browser keeps the column headers aligned with the body columns. Note that the table doesn’t have to be the first thing on the page, but once the table scrolls to the top, the header will stick there while the rest of the table continues to scroll.

See [https://developer.mozilla.org/en-US/docs/Web/CSS/position](https://developer.mozilla.org/en-US/docs/Web/CSS/position) for more details.

I’m keeping the code and the remainder of the original README here as a historical artifact.

<div style="color: gray;">

# Scrollable Tables: Historical Artifact

When you scroll a web page with a table on it, the column headings scroll out of view. Even though
HTML provides _thead_ and _tbody_ elements for dividing a table into the heading and body sections,
CSS does not provide a mechanism for “freezing” the heading cells while scrolling the body cells the
way spreadsheets do. It can be done, but the column headings will not line up with the body columns.
A second issue is to make the table responsive to changes in the vertical space allotted to the
table, for example when the user opens or closes a _details_ element or resizes the viewport.

ScrollableTable is a JavaScript class to handle the column-width and vertical space issues for HTML
tables with scrollable bodies.

## The Solution

The _ScrollableTable_ constructor makes the _thead_ and _tbody_ elements use the _block_ display
property, which breaks the layout relationship between columns in the header and body. The
`adjust_table()` method adjusts the column widths in the header and body to match each other, and
adjusts the height of the containing div either to fill the remaining space in the viewport or to
the value specified as an optional parameter to the constructor.

There is hack: there is no known way (to me) to find out when the browser has finished laying out
long tables, so the initial column-width adjustment may be based on incomplete information. After a
configuable delay (default is 2,000 milliseconds) the constructor re-calculates the column widths.

The code is pure DOM scripting that does not use or depend on any JavaScript library, nor will it
interfere with the use of any JavaScript library. (Tested on pages that use JQuery.)

## HTML and CSS Preconditions

- Each table to be adjusted must be wrapped in another HTML element, normally a _div_. When *ScrollableTable* adjusts the height of a table, it does so by adjusting the height of this _div_.
- The containing div should have zero margin, border, and padding, and it must not be positioned.
  These constraints may possbily be violated, but the results are not guaranteed.
- Each scrollable table must include both a _thead_ and _tbody_ element. Multiple _tbody_ elements
  are not supported: only the first one will scroll.
- Use CSS to set the `tbody` to `overflow: scroll;`

## Usage
Put *scrollable_tables.js* in a known location, and load it from the page’s HTML:

```html
<script src="./scrollable_tables.js" type="module"></script>`
```
Note the `type="module"` attribute. The Javascript for the page must also be loaded using that
attribute, and that code must import the ScrollableTable class. That code identifies the tables to
manage and sets up the event handlers. For example:

```javascript
import ScrollableTable from './scrollable_tables.js';
window.addEventListener('load', function ()
{
  // Make the first table with the scrollable class (if there is one) scrollable.
  const tables = document.getElementsByClassName('scrollable');
  if (tables.length > 0)
  {
    const the_table = new ScrollableTable({table: tables[0]});
    const adjust_table = the_table.get_adjustment_callback();

    // Re-process the table’s size when the viewport is resized.
    window.addEventListener('resize', adjust_table);

    // Re-process the table’s size when details elements open/close.
    const details = document.getElementsByTagName('details');
    if (details)
    {
      for (let i = 0; i < details.length; i++)
      {
        details[i].addEventListener('toggle', adjust_table);
      }
    }
  }
});

```
### Constructor Arguments
Arguments are passed as an object. All fields are optional, although omitting the _table_ field will
lead to nonsense. The other fields are:

*height*
: The desired height of the table, in pixels. If omitted, the height will be the number of pixels
from the top of the table to the bottom of the viewport.

*delay*
: Number of milliseconds to wait for the table layout to complete before re-calculating column
widths. Default is 2,000.

*padding*
: The number of pixels to add to the height of the containing _div_. This simulates bottom padding
to allow room for a horizontal scrollbar and/or to make it clear to users that the bottom of the
bottom row is visible. Default is 10 (8 for a scrollbar, 1 for a bottom border, and 1 for clarity).

*use_heading*
: Use the initial layout widths of the heading cells for the widths of the body cells. The default
behavior is, column by column, to use the wider of the column’s header cell or body cell, which may
lead to the table becoming wider when the column widths are adjusted.


> **On Callbacks**
> Event handlers are invoked in a different context from the _onload_ event handler,
> so the `get_adjustment_callback()` method provides a copy of the instance’s `adjust_table()`
> method that is bound to the instance’s _this_ value.

### Using _headers_ and _id_ for column widths
In addition to making the table adhere to accessibility guidelines, using the _headers_ attribute in
body cells and the _id_ attribute in header cells provides a way to handle cases where there are
multiple header rows in a table. For example, here is a table that has two header rows, with the
column widths determined by the first cell in the first row and the other cells in the second row:

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
If the table does not use _headers_ and _id_ attributes, the header row with the largest number of
columns, which must equal the number of columns in the first body row, will be used.

## Known Limitations
- The code assumes that the table uses the border-collapse model, and that the wider of the left and
  right borders of a cell is shared between adjacent columns.
- The left and right border widths have to be equal in the head and body.
- The code examines only the first row of the table body and does not support the _colspan_
  attribute in that row. There have to be an equal number of header columns and body columns.
- There is no provision for separately scrolling multiple _tbody_ elements within a table.

## Version Changes

### Version 2.1.0
*API Change:* Added *use_heading* option to constructor.

*Bug Fix:* Adjust both width and height, not just height on viewport resize.

*Cosmetic Fix:* Remove vertical scrollbar when scrolling isn’t needed. Update this README to add the
CSS requirement `tbody { overflow: scroll; }`(FYI: different browsers place the vertical scrollbar
differently when using `overflow: auto`).

### Version 2.0.0
The previous version waited for the web page to load, found all tables on the page with class
`scrollable`, and made the adjustments to them to make their bodies scroll “properly.” But it did
not handle accessible tables, which use the `headers` and `id` attributes to associate body cells
with their (row and) column headings; did not handle headings with multiple rows correctly, and
included bits of “superstitious” code that obscured parts of the implementation.

Version 2 retains some of the basic characteristics of Version 1: each scrollable table has to be
wrapped in a _div_, and the user has to provide code to set up event handlers for events that can
change the amount of vertical space available to the table, such as window _resize_ and details
_toggle_ events. But it is no longer necessary to use the `table_height` class for the containing
_div_ and it is no longer necessary to use the `scrollable` class for the table.

What’s new is the way in which event handlers are set up (cleaner and easier) and the ability to
work with multi-row headers, including those that use the _headers_ &#x2014; _id_ mechanism.

Under the hood, but visible to developers, is that the implementation uses JavaScript’s _class_ mechanism. Each scrollable table is made into an instance of the _ScrollableTable_ class.

</div>
