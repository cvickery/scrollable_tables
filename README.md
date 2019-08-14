# Scrollable Tables

The JavaScript function *adjust_tables()* fixes the layout problem that occurs when using CSS to
“freeze” the heading rows of a table while scrolling.

## The Problem Being Addressed

Spreadsheets typically have a freeze option so that certain rows and/or columns remain visible
when the user scrolls through the sheet. HTML tables optionally include _thead_ and _tbody_ elements
for grouping header rows and body rows, and it is possible to make the body rows scroll while
keeping the header rows in place, but when this is done, the widths of the header columns and body
columns are calculated separately and no longer line up with each other.

## The Solution

For each scrollable table on a page, this JavaScript code determines whether the head or body is
narrower than the other, and adjusts the widths of columns in the narrower part to match the widths
of the corresponding columns in the wider part. Heading rows with _colspan_ cell attributes are
taken into account.

The code is pure DOM scripting that does not use or depend on any JavaScript library. Nor should it
interfere with the use of any JavaScript library. (Tested on pages that use JQuery.)

## HTML and CSS Preconditions

- Each table to be adjusted must be wrapped in another HTML element, normally a _div_, with no
  top/bottom borders or padding. This is to allow the JavaScript code to determine the height of the
  table. (I could find no other way to do this.) It also allows you to set the height of the table
  using CSS.

- Each scrollable table must include “scrollable” as one of its _class_ attribute values.

- Each scrollable table must include both _thead_ and _tbody_ elements. Multiple _tbody_ elements
  are not supported: only the first one will scroll.

- The (first) _tbody_ element of each scrollable table must have its _overflow-y_ property set to
  either _scroll_ or _auto_ depending on whether the scrollbars are always to be visible, or visible
  only when the table needs to be scrolled.

## Usage

- Put *scrollable_tables.js* in a known location, and load it from the page’s HTML:

  `  <script src="./scrollable_tables.js"></script>`

  The *adjust_tables()* function will ... _adjust the scrollable tables!_ ... when the page loads or is
  resized.

## Known Limitations

- The code does not take border widths into account. If they are different in the heading and body
  rows, there will be visible misalignments.

- The code examines only the first row of the table body and does not currently support the
  _colspan_ attribute in that row. That is, the number of columns in the table must be equal to the
  number of _td_ elements in the first row of the body.

- There is no provision for separately scrolling multiple _tbody_ elements within a table. Or if
  there is, it hasn’t been tested.