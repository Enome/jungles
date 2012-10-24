template = """
<div ng-controller='UploadCtrl'>
  <input type='file' multiple onchange='angular.element(this).scope().upload(this)' />

  <div ng-repeat='image in images'>
    <img ng-src='{{image.src}}' width='80' height='80' />
    <button>x</button>
  </div>
</div>
"""

module.exports = template
