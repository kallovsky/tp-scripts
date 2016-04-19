//=====================================================================	
function getKMVar(pstrName) {
//=====================================================================	

	var app = Application.currentApplication()
	app.includeStandardAdditions = true

	var appKM = Application("Keyboard Maestro Engine")
		
	var oVars = appKM.variables
		
	try {
		var strValue = oVars[pstrName].value();
		
	} catch (e) {
		
		strValue = undefined
		
		app.beep()
		var oAns = app.displayAlert('KM Variable does NOT exist', {
				message: 'Var Name: ' + pstrName,
				as: 'critical'
			})

		}	// END try/catch
				
		return strValue
		
}	// END function getKMVar
//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


var TaskPaper = Application('TaskPaper')

function TPContextGetCurrentPath(editor, options) {
  var selection = editor.selection;
  var selectedItems = selection.selectedItemsCommonAncestors;

  editor.outline.groupUndoAndChanges(function() {
	var attributeName = 'data-' + options.tag
    var value = options.value;
	
	// Wenn Attribute mit gleichem Wert schon vorhanden, dann setze Wert auf Null
    selectedItems.forEach(function(each) {
      if (each.hasAttribute(attributeName) && each.getAttribute(attributeName)==value) {
        value = null;
      }
    });
  
	// Setze item und descendants auf Wert, ggf. auch auf Null (s.o.)
    selectedItems.forEach(function(each) {
      each.setAttribute(attributeName, value);
      each.descendants.forEach(function(eachDescendant) {
        eachDescendant.setAttribute(attributeName, value);
      });
      
      parent = each.parent;
      while (parent) {
        var siblingsMatch = true;
        parent.children.forEach(function(each) {
          if (each.getAttribute(attributeName) != value) {
            siblingsMatch = false;
          }
        });
        
        if (siblingsMatch) {
          parent.setAttribute(attributeName, value);
        } else {
          parent.setAttribute(attributeName, null);
        }
        parent = parent.parent;
      } 
    });
  });

  editor.moveSelectionToItems(selection);
}

var path = TaskPaper.documents[0].evaluate({
  script: TPContextGetCurrentPath.toString(),
  withOptions: { tag: 'due', value: getKMVar('KMdate') }
});