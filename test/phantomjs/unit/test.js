describe("DOM Tests", function () {
    var el = document.createElement("div");
    el.id = "myDiv";
    el.innerHTML = "Hi there!";
    el.style.background = "#ccc";
    document.body.appendChild(el);
    var myEl = document.getElementById('myDiv');
    it("is in the DOM", function () {
        expect(myEl).to.not.equal(null);
    });
    it("is a child of the body", function () {
        expect(myEl.parentElement).to.equal(document.body);
    });
    it("has the right text", function () {
        expect(myEl.innerHTML).to.equal("Hi there!");
    });
    it("has the right background", function () {
        expect(myEl.style.background).to.equal("rgb(204, 204, 204)");
    });
});

