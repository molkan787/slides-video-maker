import { PresentationRenderer } from './presentation-renderer/';

export function test1() {
    const renderer = new PresentationRenderer();
    renderer.render(test_data_kinetic, {
        type: 'kinetic',
        outputFilename: "C:\\Users\\Dahmane\\Desktop\\presentation.mp4",
        size: {
            width: 1280,
            height: 720
        },
        scale: 3
        // audioFilename: "C:\\Users\\Dahmane\\Documents\\randall_wahran.mp3"
    }).wait().then(status => {
        console.log('Finished with status:', status);
    })
}

const test_data_classic = [
    {
        content: [
            {
                rect: {
                    x: 50, y: 50,
                    width: 300,
                    height: 50
                },
                content: {
                    type: 'text',
                    text: 'Thats and escaped',
                    style: {
                        'color': 'white',
                        'text-align': 'center',
                        'text-decoration': 'underline'
                    }
                }
            },
            {
                rect: {
                    x: 200, y: 90,
                    width: 100,
                    height: 180
                },
                content: {
                    type: 'image',
                    src: 'file:///D:\\\\Projects\\\\Electron\\\\slides-video-maker\\\\static\\\\images\\\\p2.png'
                }
            }
        ],
        background: {
            type: 'color',
            color: '#5099ff'
        },
        animation: 'zoom',
        template: 'template-2',
        duration: 4000,
    }, {
        rawContent: true,
        content: [
            'Thats the second slide',
            'It is so beatiful, right?',
            'Just another smaller text!'
        ].join('\n'),
        animation: 'zoom',
        duration: 4000,
    },
    {
        rawContent: true,
        content: [
            'Thats the second slide',
            'It is so beatiful, right?',
            'Just another smaller text!'
        ].join('\n'),
        animation: 'slide',
        duration: 2000,
    }
];

const test_data_kinetic = [
    {
        content: [
            'Text size',
            'Some bigger text!',
            'Just another smaller text!'
        ],
        template: 'heavy-1',
        duration: 5000,
    }, {
        content: [
            'Second slide',
            'It is so beatifu',
            'Just another smaller text!'
        ],
        template: 'heavy-1',
        duration: 5000,
    }
]