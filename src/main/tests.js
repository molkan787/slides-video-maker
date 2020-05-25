import { PresentationRenderer } from './presentation-renderer/';

export function test1() {
    const renderer = new PresentationRenderer();
    renderer.render(test_data_classic, {
        type: 'classic',
        outputFilename: "C:\\Users\\Dahmane\\Desktop\\presentation.mp4",
        size: {
            width: 1280,
            height: 720
        }
    }).wait().then(status => {
        console.log('Finished with status:', status);
    })
}

const test_data_classic = [
    {
        content: [
            'Small text size',
            'Some bigger text is here!',
        ].join('\n'),
        animation: 'fade',
        duration: 1000,
    }, {
        content: [
            'Thats the second slide',
            'It is so beatiful, right?',
            'Just another smaller text!'
        ].join('\n'),
        animation: 'zoom',
        duration: 4000,
    },
    {
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
            'Small text size',
            'Some bigger text is here!',
            'Just another smaller text!'
        ],
        template: 'template-2',
        duration: 5000,
    }, {
        content: [
            'Thats the second slide',
            'It is so beatiful, right?',
            'Just another smaller text!'
        ],
        template: 'template-1',
        duration: 5000,
    }, {
        content: [
            'The third slide',
            'Thats fucking awesome, Right?',
            'The animations are so smooth!'
        ],
        template: 'template-2',
        duration: 5000,
    }
]