function isBasicElement(name) {
  let firstChar = name.slice(0, 1);
  return firstChar === firstChar.toLowerCase();
}


module.exports = function (babel) {
  const { types: t } = babel;
  const createElementIdentifier = t.identifier('createElement');
  
  function convertAttributeValue (node) {
    if (t.isJSXExpressionContainer(node)) {
      return node.expression
    } else {
      return node
    }
  }

  function getChildrenArray(nodeList) {
    let ret = nodeList.map((node) => {
      if (t.isJSXText(node)) {
        return t.stringLiteral(node.value);
      }
      if (t.isJSXExpressionContainer(node)) {
        return node.expression;
      }
      return node;
    });
    return ret;
  }
 
  function getAttributesArray(attributes) {
    let ret = attributes.map((attribute) => {
      if (t.isJSXSpreadAttribute(attribute)) {
        return t.SpreadProperty(t.identifier(attribute.argument.name))
      }
      let name = attribute.name.name;
      let value = attribute.value;
      return t.objectProperty(t.stringLiteral(name), convertAttributeValue(value || t.booleanLiteral(true)));
    });
    return ret;
  }

  return {
    name: "jsx-to-function",
    visitor: {
      JSXElement: {
      	exit(path) {
          if(path.node.type === 'JSXElement') {
            var name = path.node.openingElement.name.name;
            var props = [];
            var children = getChildrenArray(path.node.children);
            props = getAttributesArray(path.node.openingElement.attributes);
            props.push(t.objectProperty(t.stringLiteral('children'), t.arrayExpression(children)));
            var caller;
            if(isBasicElement(name)) {
              caller = t.CallExpression(
                createElementIdentifier,
                [
                  t.stringLiteral(name),
                  t.objectExpression(props)
                ]
              );
            } else {
              caller = t.CallExpression(
                t.identifier(name),
                [
                  t.objectExpression(props)
                ]
              );
            }
            path.replaceWith(caller);
          }
        }
      } 
    }
  };
}