/*  Table elements with the class "scrollable" will have the thead column widths set to match the
/*  widths of the columns of the tbody.
 *  The table must have one thead section containing a single row, and one tbody section.
 *  To make this work, do the following in CSS:
 *  - Set the overflow-y property of the table to hide and specify its height. You can't set the
 *    height of a table element directly, so wrap it in a div, and set the height of the div. Do not
 *    put a margin above or below the table, and do not put a border or padding on the top or
 *    bottom of the div. That is, the height of the table is assumed to be equal to the height of
 *    the div.
 *  - Set the display property of both the thead and tbody to block.
 *  - Set the position property of the tbody to absolute and the scroll-y property to auto (or to
 *    scroll if you want the scrollbar always visible).
 */

// Wait for the document to load or resize, and adjust all scrollable tables on the page.
window.onload = (event) => adjust_tables();
window.onresize = (event) => adjust_tables();

//  adjust_tables()
//  -----------------------------------------------------------------------------------------------
/*  Find all scrollable tables and make their bodies scrollable, as it were.
 */
function adjust_tables()
{
  //  Find all tables with the scrollable class and containing exactly one thead and one tbody.
  const all_tables = document.getElementsByTagName('table');
  // console.log(`There are ${all_tables.length} tables`);
  const scrollable_elements = document.getElementsByClassName('scrollable');
  let scrollable_tables = [];
  for (let i = 0; i < scrollable_elements.length; i++)
  {
    if (scrollable_elements[i].tagName === 'TABLE')
    {
      scrollable_tables.push(scrollable_elements[i]);
    }
  }
  // console.log(`There are ${scrollable_tables.length} scrollable tables`);
  for (let i = 0; i < scrollable_tables.length; i++)
  {
    // A table must have one thead and one tbody to be scrollable.
    let thead = 'Undefined';
    let tbody = 'Undefined';
    const children = scrollable_tables[i].children;
    for (let c = 0; c < children.length; c++)
    {
      let tag_name = children[c].tagName;
      if (tag_name === 'THEAD')
      {
        if (thead === 'Undefined')
        {
          thead = children[c];
        }
        else
        {
          thead = 'Multple';
        }
      }
      if (tag_name === 'TBODY')
      {
        if (tbody === 'Undefined')
        {
          tbody = children[c];
        }
        else
        {
          tbody = 'Multple';
        }
      }
    }
    //  The table is scrollable: adjust the width of the header row cells.
    if (thead !== 'Undefined' &&
        thead !== 'Multiple' &&
        tbody !== 'Undefined' &&
        tbody !== 'Multiple')
    {
      // Set the height of the tbody. Do this by getting the height of the enclosing div and
      // subtracting the height of the thead.
      const parent = scrollable_tables[i].parentNode;
      const parent_height = parent.offsetHeight;
      const first_head_row = thead.children[0].children;
      const head_height = thead.offsetHeight;
      tbody.style.height = (parent_height - head_height) + 'px';
      // Set the width of each cell in the first row of thead to match the width of each cell in the
      // first row of tbody.
      let first_body_row = tbody.children[0].children;
      for (let col = 0; col < first_body_row.length; col++)
      {
        // Because clientWidth includes horizontal padding, remove same from the header cells.
        first_head_row[col].style.paddingLeft = first_head_row[col].style.paddingRight = 0;
        first_head_row[col].style.width = first_body_row[col].clientWidth + 'px';
      }
    }
  }
};
