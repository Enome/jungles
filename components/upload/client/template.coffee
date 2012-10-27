template = """
<div class='upload'>
  <input type='file' multiple onchange='angular.element(this).scope().upload(this)' />

  <div class='file' ng-repeat='file in current'>
    <img ng-src='{{url}}/{{file}}' width='80' height='80' />
    <button ng-click='remove(file)'>x</button>
  </div>
</div>
"""

module.exports = template
