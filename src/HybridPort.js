/**
 * @class draw2d.HybridPort
 * A HybridPort can work as Input and as Output port in the same way for a {@link draw2d.Connection}.
 *
 * @author Andreas Herz
 * @extends draw2d.Port
 */

import draw2d from 'packages';

draw2d.HybridPort = draw2d.Port.extend({

    NAME : "draw2d.HybridPort",

    /**
     * @constructor
     * Create a new HybridPort element
     *
     * @param {Object} [attr] the configuration of the shape
     */
    init: function(attr, setter, getter)
    {
        this._super(attr, setter, getter);

        // responsive for the arrangement of the port
        // calculates the x/y coordinates in relation to the parent node
        this.locator=new draw2d.layout.locator.InputPortLocator();
    },

    /**
     * @inheritdoc
     */
    createCommand: function(request)
    {
       // Connect request between two ports
       //
       if(request.getPolicy() === draw2d.command.CommandType.CONNECT) {

         // if(request.source.getParent().getId() === request.target.getParent().getId()){
         //    return null;
         // }

         if (request.source instanceof draw2d.InputPort) {
            // This is the difference to the InputPort implementation of createCommand.
            return new draw2d.command.CommandConnect(request.target, request.source, request.source);
         }
         else if (request.source instanceof draw2d.OutputPort) {
            // This is the different to the OutputPort implementation of createCommand
            return new draw2d.command.CommandConnect(request.source, request.target, request.source);
         }
         else if (request.source instanceof draw2d.HybridPort) {
            // This is the different to the OutputPort implementation of createCommand
            return new draw2d.command.CommandConnect(request.target,request.source, request.source);
         }

         return null;
       }

       // ...else call the base class
       return this._super(request);
    } ,
   
   // 根据两个 port的位置确定方向
   getConnectionDirection: function (peerPort) {
      var p0 = this.getAbsolutePosition()
      var p1 = peerPort.getAbsolutePosition()

      var x = p1.x-p0.x
      var y = p1.y-p0.y

      if(Math.abs(x)>Math.abs(y)) {
         return x>0?draw2d.geo.Rectangle.DIRECTION_RIGHT: draw2d.geo.Rectangle.DIRECTION_LEFT
      }
      else {
         return y>0?draw2d.geo.Rectangle.DIRECTION_DOWN: draw2d.geo.Rectangle.DIRECTION_UP
      }
   },
   getConnectionDirectionByPoint: function (targetPoint) {
      var p0 = this.getAbsolutePosition()

      var x = targetPoint.x-p0.x
      var y = targetPoint.y-p0.y

      if(Math.abs(x)>Math.abs(y)) {
         return x>0?draw2d.geo.Rectangle.DIRECTION_RIGHT: draw2d.geo.Rectangle.DIRECTION_LEFT
      }
      else {
         return y>0?draw2d.geo.Rectangle.DIRECTION_DOWN: draw2d.geo.Rectangle.DIRECTION_UP
      }
   },
});
