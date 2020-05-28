import { promisify } from 'util';
import imageSize from 'image-size';
import { promptFile } from './helpers';
const sizeOf = promisify(imageSize);

export default class Editor{

    static async promptImage(){
        let filename = await promptFile([{
            name: 'Images/Pictures',
            extensions: ['png', 'jpg', 'jpeg', 'bmp']
        }]);
        if(filename == null) return null;
        const size = await sizeOf(filename);
        filename = filename.replace(/\\/g, '\\\\');
        return {
            filename,
            size
        }
    }

    static fitBoxInCanvas(canvas, box, scale){
        const { width: cw, height: ch } = canvas;
        const { width: bw, height: bh } = box;
        let width = bw * scale, height = bh * scale;
        if(width > cw){
            const scaleRatio = cw / width;
            width *= scaleRatio;
            height *= scaleRatio;
        }
        if(height > ch){
            const scaleRatio = ch / height;
            width *= scaleRatio;
            height *= scaleRatio;
        }
        const x = (cw - width) / 2;
        const y = (ch - height) / 2;
        return {
            x: Math.round(x),
            y: Math.round(y),
            width: Math.round(width),
            height: Math.round(height),
        }
    }

}
