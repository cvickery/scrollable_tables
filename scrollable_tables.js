/*  Table elements with the class "scrollable" will have the thead column widths set to match the
 *  widths of the columns of the tbody.
 *
 *  TODO: whether the thead or the tbody is wider
 *  TODO: different border widths for thead and tbody
 *  BUG:  left-justified thead cells when multiple thead rows
 *
 *  The table must have one thead section. The first tbody section will be scrollable.
 *
 *  The height of the table must be equal to the height of its containing element, such as a div
 *  with no margin, border, or padding.
 *
 *  Tables to be scrollable must have the "scrollable" class, and their tbodys must have the
 *  overflow-y property set to either "scroll" or "auto" depending on whether the scrollbars are
 *  always to be visible, or visible only when the table needs to be scrolled.
 */

// Wait for the document to load or resize, and adjust all scrollable tables on the page.
window.addEventListener('load', adjust_tables);
window.addEventListener('resize', adjust_tables);

//  adjust_tables()
//  -----------------------------------------------------------------------------------------------
/*  Find all scrollable tables and make their bodies scrollable, as it were.
 */
function adjust_tables() // The event, etc. parameters are not used.
{
  //  Find all tables with the scrollable class and containing exactly one thead and one tbody.
  const scrollable_elements = document.getElementsByClassName('scrollable');
  let scrollable_tables = [];
  for (let i = 0; i < scrollable_elements.length; i++)
  {
    if (scrollable_elements[i].tagName === 'TABLE')
    {
      scrollable_tables.push(scrollable_elements[i]);
    }
  }

  for (let i = 0; i < scrollable_tables.length; i++)
  {
    // A table must have one thead and one tbody to be scrollable.
    let table = scrollable_tables[i];
    let thead = 'Undefined';
    let tbody = 'Undefined';
    const children = table.children;
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
    //  If the table is scrollable, adjust the style properties and the width of the header row
    //  cells.
    if (thead !== 'Undefined' &&
        thead !== 'Multiple' &&
        tbody !== 'Undefined' &&
        tbody !== 'Multiple')
    {
      // Set the height of the tbody. Do this by getting the height of the table minus the height of
      // the thead. The height of the table is the height of its containing element; the table
      // itself does not give an accurate measure.
      const table_height = table.parentNode.offsetHeight;
      table.style.overflowY = 'hide';
      const head_height = thead.offsetHeight;
      tbody.style.height = (table_height - head_height) + 'px';
      thead.style.display = 'block';
      tbody.style.display = 'block';
      tbody.style.position = 'absolute';
      console.log(`${i}: ${table.offsetWidth} ${thead.offsetWidth} ${tbody.offsetWidth}`);

      // Find the thead row with the max number of columns
      let longest_thead_row_num = 0;
      let longest_thead_num_rows = 0;
      let longest_thead_row_width = 0;
      for (let row = 0; row < thead.children.length; row++)
      {
        let this_row = thead.children[row];
        if (this_row.children.length > longest_thead_num_rows)
        {
          longest_thead_row_num = row;
          longest_thead_num_rows = this_row.children.length;
          longest_thead_row_width = 0;
          for (let col = 0 ; col < longest_thead_num_rows; col++)
          {
            longest_thead_row_width += this_row.children[col].offsetWidth;
          }
        }
      }
      console.log(`thead: ${longest_thead_row_num} ${longest_thead_num_rows} ${longest_thead_row_width}`);
      // Set the width of each cell in the longest row of thead to match the width of each cell in
      // the first row of tbody.
      // const first_head_row = thead.children[0].children;
      const longest_head_row = thead.children[longest_thead_row_num].children;
      let first_body_row = tbody.children[0].children;
      for (let col = 0; col < first_body_row.length; col++)
      {
        // Because clientWidth includes horizontal padding, remove same from the header cells being
        // resized.
        longest_head_row[col].style.paddingLeft = 0;
        longest_head_row[col].style.paddingRight = 0;
        longest_head_row[col].style.width = first_body_row[col].clientWidth + 'px';
      }
    }
  }
}
