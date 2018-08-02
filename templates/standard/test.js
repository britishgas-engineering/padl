suite('DASH_NAME', function() {

  test('instantiating the element with default properties works', function() {
    var element = fixture('COMPONENT_NAMEBasicTestFixture');
    assert.equal(element.prop1, 'DASH_NAME');
    var elementShadowRoot = element.shadowRoot;
    var elementHeader = elementShadowRoot.querySelector('h2');
    assert.equal(elementHeader.innerHTML, 'Hello DASH_NAME!');
    a11ySuite('COMPONENT_NAMEBasicTestFixture');
  });

  test('setting a property on the element works', function() {
    // Create a test fixture
    var element = fixture('COMPONENT_NAMEChangedPropertyTestFixture');
    assert.equal(element.prop1, 'new-prop1');
    var elementShadowRoot = element.shadowRoot;
    var elementHeader = elementShadowRoot.querySelector('h2');
    assert.equal(elementHeader.innerHTML, 'Hello new-prop1!');
    a11ySuite('COMPONENT_NAMEChangedPropertyTestFixture');
  });

});
