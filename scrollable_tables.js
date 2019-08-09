/*  Table elements with the class "scrollable" will have the thead position set to fixed and its
 *  column widths set to match the widths of the columns of the tbody.
 */

// Wait for the document to load, and get a list of all table elements
window.onload = (event) =>
{
  console.log('page is fully loaded');
  const all_tables = document.getElementsByTagName('table');
  console.log(`There are ${all_tables.length} tables`);
  const scrollable_elements = document.getElementsByClassName('scrollable');
  let scrollable_tables = [];
  for (let i = 0; i < scrollable_elements.length; i++)
  {
    if (scrollable_elements[i].tagName === 'TABLE')
    {
      scrollable_tables.push(scrollable_elements[i]);
    }
  }
  console.log(`There are ${scrollable_tables.length} scrollable tables`);
  for (let i = 0; i < scrollable_tables.length; i++)
  {
    // A table must have one thead and one tbody to be scrollable.
    let thead = 'Undefined'
    let tbody = 'Undefined'
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
    console.log(`table ${i} thead is ${thead}`);
    console.log(`table ${i} tbody is ${tbody}`);
    if (thead !== 'Undefined' &&
        thead !== 'Multiple' &&
        tbody !== 'Undefined' &&
        tbody !== 'Multiple')
    {
      console.log(thead.offsetLeft, thead.offsetTop, thead.offsetHeight, thead.offsetWidth);
      console.log(tbody.offsetLeft, tbody.offsetTop, tbody.offsetHeight, tbody.offsetWidth);
      const body_top = tbody.offsetTop;
      const body_left = tbody.offsetLeft;
      thead.style.position = 'fixed';
      tbody.style.position = 'fixed';
      tbody.style.top = body_top + 'px';
      tbody.style.overflowY = 'scroll'
    }
  }
};
