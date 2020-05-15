class Assignment_Two_Skeleton extends Scene_Component {
     
    // The scene begins by requesting the camera, shapes, and materials it will need.
    constructor(context, control_box) {
        super(context, control_box);

        // First, include a secondary Scene that provides movement controls:
        if(!context.globals.has_controls)
            context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

        // Locate the camera here (inverted matrix).
        const r = context.width / context.height;
        context.globals.graphics_state.camera_transform = Mat4.translation([0, 0, -35]);
        context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

        // At the beginning of our program, load one of each of these shape
        // definitions onto the GPU.  NOTE:  Only do this ONCE per shape
        // design.  Once you've told the GPU what the design of a cube is,
        // it would be redundant to tell it again.  You should just re-use
        // the one called "box" more than once in display() to draw
        // multiple cubes.  Don't define more than one blueprint for the
        // same thing here.
        const shapes = {
            'square' : new Square(),
            'circle': new Circle(100),
            'tetrahedron': new Tetrahedron(false),
            'cube': new Cube(),
            'sky': new Cube(),
            'ground': new Cube(),
            'tree': new Cylinder(15),
            'branch': new Cylinder(15),
            'ball': new Subdivision_Sphere(4),
            'stem': new Cube(),
            'watermelon': new SemiCircle(15),
            'twig': new Cylinder2(15),
            'box': new Cube(),
            'prism': new TriangularPrism(),
            'branch2': new Cylinder2(15)
        }
    
        this.submit_shapes(context, shapes);
        this.shape_count = Object.keys(shapes).length;

        // Make some Material objects available to you:
        this.clay = context.get_instance(Phong_Shader).material(Color.of(.9, .5, .9, 1), {
            ambient: .4,
            diffusivity: .4
        });
        this.plastic = this.clay.override({
            specularity: .6
        });
        this.cyan = Color.of(0, 255, 127, 1);
        this.red = Color.of(255, 0, 0, 1);
        this.texture_base = context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {
            ambient: 1,
            diffusivity: 0.4,
            specularity: 0.3
        });

        this.texture_skyBlue = context.get_instance(Phong_Shader).material(Color.of(0, 200, 255, 0.5), {
            ambient: 1,
            diffusivity: 0.4,
            specularity: 0.3
        });

        this.texture_red = context.get_instance(Phong_Shader).material(Color.of(255, 0, 0, 1), {
            ambient: 1,
            diffusivity: 0.4,
            specularity: 0.3
        });
        
        this.texture_lightGreen = context.get_instance(Phong_Shader).material(Color.of(0, 200, 0, 0.5), {
            ambient: 1,
            diffusivity: 0.4,
            specularity: 0.3
        });

        this.texture_darkGreen = context.get_instance(Phong_Shader).material(Color.of(0, 255, 0, 1), {
            ambient: 1,
            diffusivity: 0.4,
            specularity: 0.3
        });

         this.texture_black = context.get_instance(Phong_Shader).material(Color.of(0, 0, 0, 1), {
            ambient: 1,
            diffusivity: 0.4,
            specularity: 0.3
        });

        this.texture_yellow = context.get_instance(Phong_Shader).material(Color.of(1, 1,0, 1), {
            ambient: 1,
            diffusivity: 0.4,
            specularity: 0.3
        });

        this.texture_purple = context.get_instance(Phong_Shader).material(Color.of(1, 0,0.5, 1), {
            ambient: 1,
            diffusivity: 0.4,
            specularity: 0.3
        });

        // Load some textures for the demo shapes
        this.shape_materials = {};
        const shape_textures = {
            //square: "assets/butterfly.png",
            //box: "assets/even-dice-cubemap.png",
            apple: "assets/apple.jpg",
            tree: "assets/treebark.png",
            sky: "assets/sky.jpeg",
            ground: "assets/grass.jpg",
            //simplebox: "assets/tetrahedron-texture2.png",
            cone: "assets/hypnosis.jpg",
            circle: "assets/hypnosis.jpg",
            leaf: "assets/leaf.png",
            cookie: "assets/cookie.png",
            caterpillerYello: "assets/butterfly_texture.png",
            cocoon: "assets/cocoon.png",
            watermelon: "assets/red_watermelon.jpg",
            rind: "assets/watermelon_green.jpg", 
            //butterfly: "butterfly-texture.png",
	        title: "assets/the-very-hungry-caterpillar.png"
	        
        };

        
        let count = 0;
        for (let t in shape_textures){
            this.shape_materials[t] = this.texture_base.override({
                texture: context.get_instance(shape_textures[t])
            });
            count = t;
        }
        //this.shape_materials[count + 1] = this.red;
        //this.lights = [new Light(Vec.of(10, 10, 20, 1), Color.of(1, 0.4, 1, 1), 100000)];
        this.lights = [new Light(Vec.of(10, 10, 20, 1), Color.of(1, 0.4, 1, 1), 100000)];
        this.t = 0;

        
    }


    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
    make_control_panel() {
        this.key_triggered_button("Pause Time", ["n"], () => {
            this.paused = !this.paused;
        });
    }

  display(graphics_state) {
        // Use the lights stored in this.lights.
        graphics_state.lights = this.lights;
                
        // Find how much time has passed in seconds, and use that to place shapes.
        if (!this.paused)
            this.t += graphics_state.animation_delta_time / 800;
        const t = this.t;

        //console.log(graphics_state.camera_transform);
        //var mySound = document.getElementbyID('sound');
        /*var songs = document.createElement("song");
        var content = document.createTextNode("assets/sound.wav");
        songs.appendChild(content);
        if(t < 90){
                var currentDiv = document.getElementById("song"); 
                document.body.insertBefore(songs, currentDiv);
        }*/
        
        

        let m = Mat4.identity();

        let cam_x = 0;
        let cam_y = 0;
        let cam_z = -35;

        let c = Mat4.identity();

        let tree_x = 0;
        let tree_y = 0;
        let tree_z = 0;
       
        // Draw some demo textured shapes

        //let spacing = 6;
        //DRAW TREE
        //m = Mat4.translation(Vec.of(-25, 0, 0));
        
        tree_x = -25;
        this.shapes.tree.draw(
             graphics_state,
             m.times(Mat4.translation(Vec.of(tree_x, tree_y, tree_z))).times(Mat4.scale(Vec.of(5,20,3))).times(Mat4.rotation(1.6, Vec.of(0, 1, 0))).times(Mat4.rotation(1.6, Vec.of(1,0,0))),
             this.shape_materials.tree || this.plastic);

        this.shapes.branch2.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(tree_x + 6, tree_y + 10, tree_z + 0))).times(Mat4.rotation(2, Vec.of(0, 1, 0))).times(Mat4.scale(Vec.of(0.5, 9.5, 10))).times(Mat4.translation(Vec.of(1, 0.1, 0))),
            this.shape_materials.tree || this.plastic);

        this.shapes.cube.draw(
             graphics_state,
             m.times(Mat4.translation(Vec.of(tree_x + 11, tree_y + 8.25, tree_z - 2.5))).times(Mat4.rotation(2.5, Vec.of(0, 0, 1))).times(Mat4.scale(Vec.of(1.3, 1.3, 0.1))),
             this.shape_materials.leaf|| this.plastic);

        this.shapes.cube.draw(
             graphics_state,
             m.times(Mat4.translation(Vec.of(tree_x + 5.5,tree_y + 13.3, tree_z - 2.5))).times(Mat4.rotation(2.5, Vec.of(0, 0, 1))).times(Mat4.scale(Vec.of(1.3, 1.3, 0.1))),
             this.shape_materials.leaf|| this.plastic);

        let apple_x = tree_x;
        let apple_y = tree_y;
        let apple_z = tree_z;

        let stem_x = apple_x;
        let stem_y = tree_y;
        let stem_z = tree_z;

        let leaf_x = apple_x;
        let leaf_y = tree_y;
        let leaf_z = tree_z;


        //Draw ground
        this.shapes.ground.draw(
             graphics_state,
             m.times(Mat4.translation(Vec.of(0,-14,0))).times(Mat4.scale(Vec.of(400,0.01,400))),
             this.shape_materials.ground || this.plastic);

 this.shapes.square.draw(
               graphics_state,
               m.times(Mat4.translation(Vec.of(-14, -9.65, -1))).times(Mat4.scale(4.75)),
               this.shape_materials.title || this.plastic);


        //Draw falling apple
       if (0 <= t && t < 2) {
        apple_x += 10;
        apple_y += 11;
        apple_z += 0;

        stem_y += 13;
        stem_z += 0;

        leaf_x;
        leaf_y;

        cam_x += -apple_x*t/2;
        cam_y += -apple_y*t/2;
        cam_z += 10*t;
       
        this.shapes.stem.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(stem_x, stem_y, stem_z))).times(Mat4.scale(Vec.of(0.1,0.5,0.1))),
                this.shape_materials.tree || this.plastic);
        this.shapes.cube.draw(
             graphics_state,
             m.times(Mat4.translation(Vec.of(stem_x, stem_y, stem_z))).times(Mat4.rotation(2.5, Vec.of(0, 0, 1))).times(Mat4.scale(Vec.of(1.3, 1.3, 0.1))),
             this.shape_materials.leaf|| this.plastic);
        this.shapes.ball.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(apple_x, apple_y, apple_z))).times(Mat4.scale(Vec.of(1.75,1.75,1))),
            this.shape_materials.apple || this.plastic);
       }
       if (2 <= t && t < 4) {
        apple_x += 10 + (t-2)*2;
        apple_y += 11 - 6*(t-2)*(t-2);
        apple_z += 0;

        stem_x = apple_x;
        stem_y += 13 - 6*(t-2)*(t-2);
        stem_z += 0;

        cam_x += -apple_x;
        cam_y += -apple_y;
        cam_z += 20;
        
        let m_stem = m.times(Mat4.translation(Vec.of(apple_x, apple_y, apple_z))).times(Mat4.rotation(2*Math.PI*(t-2)/2.5, Vec.of(0,0,-1)));
        this.shapes.cube.draw(
             graphics_state,
             m_stem.times(Mat4.translation(Vec.of(0.5, 2.2, 0.1))).times(Mat4.rotation(2.5, Vec.of(0, 0, 1))).times(Mat4.scale(Vec.of(0.3, 0.3, 0.1))),
             this.shape_materials.leaf|| this.plastic);
        this.shapes.ball.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(apple_x, apple_y, apple_z))).times(Mat4.rotation(2*Math.PI*(t-2)/2.5, Vec.of(0,0,-1))).times(Mat4.scale(Vec.of(1.75,1.75,1))),
            this.shape_materials.apple || this.plastic);
        this.shapes.stem.draw(
                graphics_state,
                m_stem.times(Mat4.translation(Vec.of(0, 2, 0))).times(Mat4.scale(Vec.of(0.1,0.5,0.1))),
                this.shape_materials.tree || this.plastic);
        }
        if (4 <= t && t < 6) {
            apple_x += 10 + (t-2)*2;
            apple_y += -12 + 12*(t-4) - 6*(t-4)*(t-4);
            apple_z += 0;

            stem_x = apple_x;
            stem_y += -10 + 12*(t-4) - 6*(t-4)*(t-4);
            stem_z += 0;

            cam_x += -apple_x;
            cam_y += -apple_y;
            cam_z += 20;

        let m_stem = m.times(Mat4.translation(Vec.of(apple_x, apple_y, apple_z))).times(Mat4.rotation(2*Math.PI*(t-2)/2.5, Vec.of(0,0,-1)));
        this.shapes.ball.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(apple_x, apple_y, apple_z))).times(Mat4.rotation(2*Math.PI*(t-2)/2.5, Vec.of(0,0,-1))).times(Mat4.scale(Vec.of(1.75,1.75,1))),
            this.shape_materials.apple || this.plastic);
        this.shapes.stem.draw(
                graphics_state,
                m_stem.times(Mat4.translation(Vec.of(0, 2, 0))).times(Mat4.scale(Vec.of(0.1,0.5,0.1))),
                this.shape_materials.tree || this.plastic);
        this.shapes.cube.draw(
             graphics_state,
             m_stem.times(Mat4.translation(Vec.of(0.5, 2.2, 0.1))).times(Mat4.rotation(2.5, Vec.of(0, 0, 1))).times(Mat4.scale(Vec.of(0.3, 0.3, 0.1))),
             this.shape_materials.leaf|| this.plastic);
        
        }
        if (6 <= t && t < 7) {
            apple_x += 10 + (t-2)*2;
            apple_y += -12 + 6*(t-6) - 6*(t-6)*(t-6);
            apple_z += 0;

            stem_x = apple_x;
            stem_y +=  -10 + 6*(t-6) - 6*(t-6)*(t-6);
            stem_z += 0;

            cam_x += -apple_x;
            cam_y += -apple_y;
            cam_z += 20;
            
            let m_stem = m.times(Mat4.translation(Vec.of(apple_x, apple_y, apple_z))).times(Mat4.rotation(2*Math.PI*(t-2)/2.5, Vec.of(0,0,-1)));
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x, apple_y, apple_z))).times(Mat4.rotation(2*Math.PI*(t-2)/2.5, Vec.of(0,0,-1))).times(Mat4.scale(Vec.of(1.75,1.75,1))),
                this.shape_materials.apple || this.plastic);
            this.shapes.stem.draw(
                graphics_state,
                m_stem.times(Mat4.translation(Vec.of(0, 2, 0))).times(Mat4.scale(Vec.of(0.1,0.5,0.1))),
                this.shape_materials.tree || this.plastic);
            this.shapes.cube.draw(
             graphics_state,
             m_stem.times(Mat4.translation(Vec.of(0.5, 2.2, 0.1))).times(Mat4.rotation(2.5, Vec.of(0, 0, 1))).times(Mat4.scale(Vec.of(0.3, 0.3, 0.1))),
             this.shape_materials.leaf|| this.plastic);
        }
        if (7 <= t) {
            apple_x += 20;
            apple_y += -12;
            apple_z += 0;

            stem_x = apple_x;
            stem_y +=  -10;
            stem_z += 0;
            
            cam_x += -apple_x;
            cam_y += -apple_y;
            cam_z += 20;
            
            let m_leaf = m.times(Mat4.translation(Vec.of(stem_x, stem_y, stem_z)));
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x, apple_y, apple_z))).times(Mat4.scale(Vec.of(1.75,1.75,1))),
                this.shape_materials.apple || this.plastic);
            this.shapes.stem.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(stem_x, stem_y, stem_z))).times(Mat4.scale(Vec.of(0.1,0.5,0.1))),
                this.shape_materials.tree || this.plastic);
             this.shapes.cube.draw(
             graphics_state,
             m_leaf.times(Mat4.translation(Vec.of(0.5, 0.2, 0))).times(Mat4.rotation(2.5, Vec.of(0, 0, 1))).times(Mat4.scale(Vec.of(0.3, 0.3, 0.1))),
             this.shape_materials.leaf|| this.plastic);
        }

        if(9 <= t && t < 10.5){
               this.shapes.circle.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 0.5, -11.25, 2))).times(Mat4.scale(0.3)),
                this.texture_black || this.plastic
            ); 
        }

        if(10.5 <= t && t < 12){
             this.shapes.circle.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 0.5, -11.25, 2))).times(Mat4.scale(0.5)),
                this.texture_black || this.plastic
            );  
        }

         if(12 <= t){
             this.shapes.circle.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 0.5, -11.25, 2))).times(Mat4.scale(0.75)),
                this.texture_black || this.plastic
            );  
        }

        if(13.5 <= t && t < 15){
            this.draw_antennae(graphics_state,m.times(Mat4.translation(Vec.of(apple_x + 0.5, -9.5, 7))), 1, 0);
            this.draw_antennae(graphics_state,m.times(Mat4.translation(Vec.of(apple_x + 0.5, -9.5, 7))), -1, 0);
            /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 0.2, -8.9, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.1))).times(Mat4.rotation(1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 0.8, -8.9, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.1))).times(Mat4.rotation(-1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 0.5, -9.5, 7)));
            //this.draw_eyes(graphics_state, m_eyes, 1);
            //this.draw_eyes(graphics_state, m_eyes, -1);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 0.5, -9.5, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
            /*this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-0.22, 0.75, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);
            this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(0.1, 0.75, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic
            ); */
        }

        if(15 <= t && t < 16.5){
            this.draw_antennae(graphics_state, m.times(Mat4.translation(Vec.of(apple_x + 1.5, -9.5, 7))), 1 , 0);
            this.draw_antennae(graphics_state, m.times(Mat4.translation(Vec.of(apple_x + 1.5, -9.5, 7))), -1 , 0);
            /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 1.2, -8.9, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.05))).times(Mat4.rotation(1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 1.8, -8.9, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.05))).times(Mat4.rotation(-1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 1.5, -9.5, 7)));
            //let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 0.5, -9.5, 7)));
          //  this.draw_eyes(graphics_state, m_eyes, 1);
          //  this.draw_eyes(graphics_state, m_eyes, -1);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 1.5, -9.5, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
            /*this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-0.4, 0.75, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);
            this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-0.1, 0.75, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);*/
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 0.6, -9.75, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic);
        }
        if(16.5 <= t && t < 17){
            this.draw_antennae(graphics_state, m.times(Mat4.translation(Vec.of(apple_x + 2.5, -9.5, 7))), 1, 0);
            this.draw_antennae(graphics_state, m.times(Mat4.translation(Vec.of(apple_x + 2.5, -9.5, 7))), -1, 0);
            /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 2.2, -8.9, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.1))).times(Mat4.rotation(1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 2.8, -8.9, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.1))).times(Mat4.rotation(-1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 2.5, -9.5, 7)));
            //let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 1.5, -9.5, 7)));
          //  this.draw_eyes(graphics_state, m_eyes, 1);
          //  this.draw_eyes(graphics_state, m_eyes, -1);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 2.5, -9.5, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
            /*this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-0.55, 0.75, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);
            this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-0.25, 0.75, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);*/
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 1.6, -9.75, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 0.7, -9.5, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
        }
        //cam_x += 0;
        //cam_y += -1;
        //cam_z += 0;
        if(17 <= t && t < 18.5){
            this.draw_antennae(graphics_state, m.times(Mat4.translation(Vec.of(apple_x + 3.5, -9.5, 7))), 1, 0);
            this.draw_antennae(graphics_state, m.times(Mat4.translation(Vec.of(apple_x + 3.5, -9.5, 7))), -1, 0);
            /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 3.2, -8.9, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.05))).times(Mat4.rotation(1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 3.8, -8.9, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.05))).times(Mat4.rotation(-1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 3.5, -9.5, 7)));
            //let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 2.5, -9.5, 7)));
       //     this.draw_eyes(graphics_state, m_eyes, 1);
       //     this.draw_eyes(graphics_state, m_eyes, -1);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 3.5, -9.5, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
            /*this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-0.7, 0.75, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);
            this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-0.4, 0.75, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);*/
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 2.6, -9.75, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 1.7, -9.5, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 0.8, -9.75, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic);
        }

        if(18.5 <= t && t < 19){
            this.draw_antennae(graphics_state,m.times(Mat4.translation(Vec.of(apple_x + 4.5, -10.1, 7))), 1, 0);
            this.draw_antennae(graphics_state,m.times(Mat4.translation(Vec.of(apple_x + 4.5, -10.1, 7))), -1, 0 );
            /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 4.3, -9.4, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.05))).times(Mat4.rotation(1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 4.8, -9.4, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.05))).times(Mat4.rotation(-1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
           let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 4.5, -10.1, 7)));
           //let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 3.5, -9.5, 7)));
      //     this.draw_eyes(graphics_state, m_eyes, 1);
      //      this.draw_eyes(graphics_state, m_eyes, -1);
           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 4.5, -10.1, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
            /*this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-0.85, 0.8, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);
            this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-0.55, 0.8, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);*/
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 3.6, -10.3, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 2.7, -10.15, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 1.8, -10.15, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 0.9, -9.75, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
        }

       

        if(19 <= t && t < 20.5){
            this.draw_antennae(graphics_state,m.times(Mat4.translation(Vec.of(apple_x + 5.5, -10, 7))), 1, 0);
            this.draw_antennae(graphics_state,m.times(Mat4.translation(Vec.of(apple_x + 5.5, -10, 7))), -1, 0 );
            /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 5.3, -9.425, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.05))).times(Mat4.rotation(1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 5.8, -9.425, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.05))).times(Mat4.rotation(-1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
           let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 5.5, -10, 7)));
     //      this.draw_eyes(graphics_state, m_eyes, 1);
     //       this.draw_eyes(graphics_state, m_eyes, -1);
           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 5.5, -10, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
            /*this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-1, 0.8, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);
            this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-0.7, 0.8, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);*/
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 4.6, -10.2, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 3.7, -10, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 2.8, -10.1, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 1.9, -9.9, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 0.95, -9.75, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic); 
        }

        let cat_x = -apple_x - 6.2;
        let cat_y = -9.45;
        let cat_z = 0;

        if(20.5 <= t && t < 21.5){
            this.draw_antennae(graphics_state, m.times(Mat4.translation(Vec.of(apple_x + 6.5, -10.1, 7))), 1, 0 );
            this.draw_antennae(graphics_state, m.times(Mat4.translation(Vec.of(apple_x + 6.5, -10.1, 7))), -1, 0 );
            /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 6.2, -9.45, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.05))).times(Mat4.rotation(1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 6.8, -9.45, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.05))).times(Mat4.rotation(-1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
           let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 6.5, -10.1, 7)));
     //      this.draw_eyes(graphics_state, m_eyes, 1);
     //       this.draw_eyes(graphics_state, m_eyes, -1);
           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 6.5, -10.1, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
            /*this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-1.2, 0.8, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);
            this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-0.9, 0.8, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);*/
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 5.6, -10.3, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 4.7, -10.1, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 3.8, -10.3, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 2.9, -10.1, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 1.95, -10.3, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic); 
        }

        if(21.5 <= t && t < 23){
           //cam_x += -5;
           this.draw_antennae(graphics_state,  m.times(Mat4.translation(Vec.of(apple_x + 8, -10.1, 7))),1, 0 );
                      this.draw_antennae(graphics_state,  m.times(Mat4.translation(Vec.of(apple_x + 8, -10.1, 7))),-1, 0 );
          /* this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 7.8, -9.45, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.05))).times(Mat4.rotation(1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 8.3, -9.45, 7))).times(Mat4.scale(Vec.of(0.1,0.3,0.05))).times(Mat4.rotation(-1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
           let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 8, -10.1, 7)));
   //        this.draw_eyes(graphics_state, m_eyes, 1);
   //         this.draw_eyes(graphics_state, m_eyes, -1);
           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 8, -10.1, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
           /* this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-1.4, 0.8, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);
            this.shapes.circle.draw(graphics_state,
                m_eyes.times(Mat4.translation(Vec.of(-1.1, 0.8, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);*/
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 7.1, -10.3, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 6.2, -10.1, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 5.3, -10.3, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 4.4, -10.1, 7))).times(Mat4.scale(0.5)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 3.45, -10.3, 7))).times(Mat4.scale(0.5)),
                this.texture_yellow  || this.plastic); 
        }
        if(t >= 23 && t < 31.5){
             //cam_x += 4;
               // cam_y += -1;
             this.draw_caterpillar(graphics_state, m, apple_x, 1, 23, 24.5, t, 0);
             //cam_x += 3;
             this.draw_caterpillar(graphics_state, m, apple_x, 2, 24.5, 26, t, 0);
             this.draw_caterpillar(graphics_state, m, apple_x, 3, 26, 27.5, t, 0);
             //cam_x += 3;
             this.draw_caterpillar(graphics_state, m, apple_x, 4, 27.5, 28, t, 0);
             //cam_x += -2.5;
              //cam_x += 3;
             this.draw_caterpillar(graphics_state, m, apple_x, 5, 28, 29.5, t, 0);
             //cam_x += -8;
             this.draw_caterpillar(graphics_state, m, apple_x, 6, 29.5, 31, t, 0);
             cam_x += -14;
             this.draw_caterpillar(graphics_state, m, apple_x, 7, 31, 32.5, t, 0);

        }

        if(t >= 31.5 && t <= 42){
                cam_x += 4;
                this.draw_caterpillar(graphics_state, m, apple_x, 8, 32.5, 34, t, 0);
                this.draw_caterpillar(graphics_state, m, apple_x, 9, 34, 35.5, t, 0);
                if(t < 42){
                if(t <= 38){
                this.shapes.watermelon.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 31, -7.45, 5.2))).times(Mat4.scale(4)),
                this.shape_materials.watermelon || this.plastic);
              
                this.shapes.watermelon.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 31, -7.5, 5))).times(Mat4.scale(4.5)),
                this.shape_materials.rind || this.plastic);
                }
                else if(t >= 38 && t < 40){
                         this.shapes.watermelon.draw(
                        graphics_state,
                        m.times(Mat4.translation(Vec.of(apple_x + 31, -7.95, 5.2))).times(Mat4.scale(3)),
                        this.shape_materials.watermelon || this.plastic);
              
                        this.shapes.watermelon.draw(
                        graphics_state,
                        m.times(Mat4.translation(Vec.of(apple_x + 31, -8, 5))).times(Mat4.scale(3.5)),
                        this.shape_materials.rind || this.plastic);
                }
                else{
                    this.shapes.watermelon.draw(
                        graphics_state,
                        m.times(Mat4.translation(Vec.of(apple_x + 31, -8.95, 5.2))).times(Mat4.scale(2)),
                        this.shape_materials.watermelon || this.plastic);
              
                        this.shapes.watermelon.draw(
                        graphics_state,
                        m.times(Mat4.translation(Vec.of(apple_x + 31, -9, 5))).times(Mat4.scale(2.5)),
                        this.shape_materials.rind || this.plastic);    
                        }
                }

                this.draw_caterpillar(graphics_state, m, apple_x, 10, 35.5, 37, t, 0);

                this.shapes.ball.draw(
                        graphics_state,
                        m.times(Mat4.translation(Vec.of(apple_x + 48, -8.5, 5))).times(Mat4.scale(Vec.of(3, 3, 0))),
                        this.shape_materials.cookie || this.plastic);
                
                this.draw_caterpillar(graphics_state, m, apple_x, 13, 37, 38, t, 0);
                this.draw_caterpillar(graphics_state, m, apple_x, 13.5, 38, 39.5, t, 0);
                this.draw_caterpillar(graphics_state, m, apple_x, 13.75, 39.5, 40.25, t, 0.1);
                this.draw_caterpillar(graphics_state, m, apple_x, 14, 40.25, 42, t, 0.1);
                cam_x += -30;
                /*this.draw_caterpillar(graphics_state, m, apple_x, 14.5, 42, 43.5, t, 0.2);
                this.draw_caterpillar(graphics_state, m, apple_x, 16, 43.5, 45, t, 0.2);
                cam_x += -5;
                this.draw_caterpillar(graphics_state, m, apple_x, 17.5, 45, 46.5, t, 0.2);
                this.draw_caterpillar(graphics_state, m, apple_x, 19, 46.5, 48, t, 0.2);
                this.draw_caterpillar(graphics_state, m, apple_x, 20.5, 48, 49.5, t, 0.2);
                this.draw_caterpillar(graphics_state, m, apple_x, 22, 49.5, 51, t, 0.2);
                this.draw_caterpillar(graphics_state, m, apple_x, 23.5, 51, 900, t, 0.2);
                cam_x += -10;*/
        }
        if(t > 42 && t < 48){
                 this.shapes.ball.draw(
                        graphics_state,
                        m.times(Mat4.translation(Vec.of(apple_x + 48, -8.5, 5))).times(Mat4.scale(Vec.of(3, 3, 0))),
                        this.shape_materials.cookie || this.plastic);
            this.draw_caterpillar(graphics_state, m, apple_x, 14.5, 42.1, 43.5, t, 0.2);
                this.draw_caterpillar(graphics_state, m, apple_x, 16, 43.5, 45, t, 0.2);
                //cam_x += -5;
                this.draw_caterpillar(graphics_state, m, apple_x, 17.5, 45, 46.5, t, 0.2);
                this.draw_caterpillar(graphics_state, m, apple_x, 19, 46.5, 48, t, 0.2);
               
                cam_x += -30;    
        }

        if(t >= 48 && t <= 56){
                if(t < 52){
                   this.shapes.ball.draw(
                        graphics_state,
                        m.times(Mat4.translation(Vec.of(apple_x + 48, -8.5, 5))).times(Mat4.scale(Vec.of(3, 3, 0))),
                        this.shape_materials.cookie || this.plastic);     
                }
                else if(t >= 52 && t < 54.5){
                        this.shapes.watermelon.draw(
                        graphics_state,
                        m.times(Mat4.translation(Vec.of(apple_x + 48, -8.5, 5))).times(Mat4.scale(Vec.of(3, 3, 1))),
                        this.shape_materials.cookie || this.plastic);
                }
                this.draw_caterpillar(graphics_state, m, apple_x, 20.5, 48, 49.5, t, 0.2);
                this.draw_caterpillar(graphics_state, m, apple_x, 22, 49.5, 51, t, 0.2);
                this.draw_caterpillar(graphics_state, m, apple_x, 23.5, 51, 52, t, 0.2); 
                this.draw_caterpillar(graphics_state, m, apple_x, 24.5, 52, 54.5, t, 0.3); 
                this.draw_caterpillar(graphics_state, m, apple_x, 25.5, 54.5, 56, t, 0.5); 
                cam_x += -45;

        }
        if(t > 56 && t < 60.5){
              this.draw_caterpillar(graphics_state, m, apple_x, 27, 56, 57.5, t, 0.5);  
              cam_x += -45;
              this.draw_caterpillar(graphics_state, m, apple_x, 28, 57.5, 59, t, 0.5); 
              this.draw_caterpillar(graphics_state, m, apple_x, 29, 59, 60.5, t, 0.5);
              this.draw_caterpillar(graphics_state, m, apple_x, 30, 60.5, 61.5 , t, 0.5);
        }

        if(t >= 60.5 && t <= 63.5){
              
            this.draw_caterpillar(graphics_state, m, apple_x, 31.5, 61.5,62.5 , t, 0.5);
            this.draw_caterpillar(graphics_state, m, apple_x, 33, 62.5, 63.5 , t, 0.5); 
            cam_x += -60;
        }

        if(t > 63.5 && t < 64 ){
              cam_x += -60;
              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 59, -7.75, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 60, -7.75, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );*/

            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 59.5, -9, 7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + 59.5, -9, 7)));
           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 59.5, -9, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 57.9, -10.3, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 55.9, -10.1, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 53.8, -10.3, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 51.6, -10.1, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 49.75, -10.3, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

        if(t >= 64 && t < 65){
              //cam_x += -60;
              cam_x += -62;
              cam_y += -1;
              cam_z += -5;

              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 62, -6.6, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 61, -6.6, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/

             let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 61.6, -7.9, 7)));
            this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 61.6, -7.9, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 60, -9.12, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 58.25, -10.1, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 56.225, -10.4, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 54.19, -10.1, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 51.9, -10.4, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }
        
         if(t >= 65 && t < 66){
              //cam_x += -60;
	  cam_x += -62;
              cam_y += -1;
              cam_z += -5;

              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 63.6, -5.75, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 62.4, -5.75, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/

            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 63, -6.94, 7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 63, -6.94, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 61.4, -8.05, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 59.8, -9.3, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 58.15, -10.4, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 56.19, -10.1, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 54.1, -10.4, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

        if(t >= 66 && t < 67){
             /* cam_x += -62;
              cam_y += -0.5;*/
	  cam_x += -62;
              cam_y += -1;
              cam_z += -5;

              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 64.6, -5.5, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 63.4, -5.5, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/

            let m_stem =  m.times(Mat4.translation(Vec.of(apple_x + 64, -6.4, 7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 64, -6.4, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 62.2, -7.25, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 60.45, -8.3, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 58.6, -9.3, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 56.65, -10.5, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 54.42, -11.4, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

        if(t >= 67 && t < 68){
              cam_x += -62;
              cam_y += -1;
              cam_z += -5;
              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 66.2, -4, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 65, -4.05, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 65.75, -5.3,7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 65.75, -5.3,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 64, -6.22, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 62.35, -7.31, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 60.65, -8.3, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 58.9, -9.35, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 57.8, -11.3, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

         if(t >= 68 && t < 69){
              /*cam_x += -65;
              cam_y += -3;
              cam_z += -8;*/
	  cam_x += -62;
              cam_y += -1;
              cam_z += -5;

              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 69.4, -2.7, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 68.15, -2.8, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 68.9, -3.9,7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 68.9, -3.9,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 67.15, -4.75, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 65.39, -5.75, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 63.56, -6.65, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 61.75, -7.65, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 59.85, -8.6, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

        if(t >= 69 && t < 70){
             /* cam_x += -65;
              cam_y += -5;
              cam_z += -11;*/
	  cam_x += -62;
              cam_y += -1;
              cam_z += -5;

              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 71.5, -0.85, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 70.25, -0.85, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 71, -2.1,7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 71, -2.1,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 69.5, -3.2, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 67.8, -4.2, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 66.2, -5.3, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 64.35, -6.1, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 62.7, -7.3, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

        if(t >= 70 && t < 71){
              /*cam_x += -69;
              cam_y += -6;
              cam_z += -11;*/
	          cam_x += -74;
              cam_y += -9.5;
              cam_z += -12;

              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 73.45, 0.3, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 72.3, 0.3, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 73, -1,7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 73, -1,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 71.45, -2, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 69.9, -3.2, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 68.2, -4.2, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 66.5, -5.2, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 64.7, -6.3, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

        if(t >= 71 && t < 72){
              /*cam_x += -72;
              cam_y += -8;
              cam_z += -11;*/
	 cam_x += -74;
              cam_y += -9.5;
              cam_z += -12;

             /* this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 75.45, 1.3, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 74.3, 1.3, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
           


            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 75, 0,7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);


           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 75, 0,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 73.4, -1, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 71.75, -2.1, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 70, -3.1, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 68.2, -4.2, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 66.4, -5.4, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

         if(t >= 72 && t < 73){
              cam_x += -74;
              cam_y += -9.5;
              cam_z += -12;
              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 77.5, 3, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 76.5, 3, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/

             let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 77, 2,7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 77, 2,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 75.4, 1, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 73.75, -0.2, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 72, -1.25, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 70.29, -2.5, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 68.5, -3.7, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

        if(t >= 73 && t < 74){
             /* cam_x += -77;
              cam_y += -10;
              cam_z += -14;*/

	         //cam_x += -77.5;
              cam_x += -79;
              cam_y += -11;
              cam_z += -14;

              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 79.5, 5, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 78.5, 5, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/

            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 79, 4,7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 79, 4,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 77.5, 2.8, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 75.95, 1.5, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 74.45, 0.2, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 72.89, -1.15, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 71.2, -2.5, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

         if(t >= 74 && t < 75){
              /*cam_x += -77;
              cam_y += -10;
              cam_z += -14;*/

	          //cam_x += -77.5;
              cam_x += -79;
              cam_y += -11;
              cam_z += -14;

              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 81.5, 7, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 80.5, 7, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/

            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 81, 6,7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 81, 6,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 79.5, 5, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 78.17, 3.5, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 76.8, 2.1, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 75.2, 1, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 73.37, 0.1, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }
        if(t >= 75 && t < 76){
              //cam_x += -77.5;
              cam_x += -79;
              cam_y += -11;
              cam_z += -14;
              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84.5, 9, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83.5, 9, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 84, 8,7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 8,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 82.5, 6.7, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 81, 5.5, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 79.8, 4, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 78.2, 3, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 76.7, 1.75, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }
        
        if(t >= 76 && t < 76.5){
              //cam_x += -77.5;
              cam_x += -79;
              cam_y += -11;
              cam_z += -14;
             /* this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84.5, 8.75, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83.5, 8.75, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 84, 7.75,7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 7.75,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83.75, 6, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83, 4.2, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 81.5, 3, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 79.75, 2.25, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 77.9, 2.5, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

        if(t >= 76.5 && t < 77){
              //cam_x += -77.5;
              cam_x += -79;
              cam_y += -11;
              cam_z += -14;
             /* this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84.5, 8.5, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83.5, 8.5, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 84, 7.25,7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 7.25,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 5.3, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83.95, 3.4, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83.3, 1.5, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 81.25, 1.9, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 80, 3.5, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }
        
        if(t >= 77 && t < 77.5){
              //cam_x += -77.5;
              cam_x += -79;
              cam_y += -11;
              cam_z += -14;
             /* this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84.5, 8, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83.5, 8, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 84, 7,7)));
           this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 7,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 5.1, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 3, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83.2, 1.5, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 81.5, 2.2, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 81.5, 4.1, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

        if(t >= 77.5 && t < 78){
              //cam_x += -77.5;
              cam_x += -79;
              cam_y += -11;
              cam_z += -14;
              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84.5, 7, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83.5, 7, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 84, 6,7)));
            this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 6,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 4.1, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 2, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83.2, 0.5, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 81.75, 1.3, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 82.5, 3.1, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

        if(t >= 78 && t < 79){
              //cam_x += -77.5;
              cam_x += -79;
              cam_y += -11;
              cam_z += -14;
              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84.5, 7, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83.5, 7, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/

            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 84, 6,7)));
            this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 6,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84.4, 4.1, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84.3, 2, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 82.5, 1.25, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 81.75, 3.2, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 82.5, 5, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }

        if(t >= 79 && t < 79.5){
              //cam_x += -77.5;
              cam_x += -79;
              cam_y += -11;
              cam_z += -14;
          this.shapes.ball.draw(graphics_state,
          m.times(Mat4.translation(Vec.of(apple_x + 82.8, 4.3, 9))).times(Mat4.scale(Vec.of(2.5, 4, 1))),
          this.shape_materials.cocoon|| this.plastic
          );
              /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84.5, 7, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 83.5, 7, 7))).times(Mat4.scale(Vec.of(0.1 * 2,0.3 * 2,0.05 * 2))).times(Mat4.rotation(-1.2, Vec.of(0, 0, 0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
            let m_stem = m.times(Mat4.translation(Vec.of(apple_x + 84, 6,7)));
            this.draw_antennae(graphics_state, m_stem, 1, 0.5);
           this.draw_antennae(graphics_state, m_stem, -1, 0.5);

           this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 6,7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
            this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84.4, 4.1, 7.2))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84.3, 2, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 82.5, 1.25, 7))).times(Mat4.scale(1)),
                this.texture_yellow || this.plastic); 
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 81.75, 3.2, 7))).times(Mat4.scale(1)),
                this.texture_purple || this.plastic);
             this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 82.5, 5, 7))).times(Mat4.scale(1)),
                this.texture_yellow  || this.plastic);   
        }
         if(t >= 1){
                //cam_y += -5;
               // cam_x 
                this.shapes.twig.draw(
                        graphics_state,
                        m.times(Mat4.translation(Vec.of(apple_x + 66, -7.5, 6))).times(Mat4.rotation(1, Vec.of(1.2, -2.4, -1))).times(Mat4.scale(Vec.of(0.7, 0.1, 8))),
                        this.shape_materials.tree || this.plastic);
                this.shapes.tree.draw(
                         graphics_state,
                         m.times(Mat4.translation(Vec.of(apple_x + 76, tree_y + 4, tree_z))).times(Mat4.scale(Vec.of(6,20,3))).times(Mat4.rotation(1.6, Vec.of(0, 1, 0))).times(Mat4.rotation(1.6, Vec.of(1,0,0))),
                         this.shape_materials.tree || this.plastic);

                this.shapes.branch.draw(
                        graphics_state,
                        m.times(Mat4.translation(Vec.of(apple_x + 83, tree_y + 2 , tree_z + 3))).times(Mat4.rotation(2, Vec.of(0, 1, 1))).times(Mat4.scale(Vec.of(1, 1 ,10))).times(Mat4.translation(Vec.of(1, 1, 0))),
                        this.shape_materials.tree || this.plastic);
        }
        if(t >=79.5 && t < 80.5){
              //cam_x += -77.5;
              cam_x += -79;
              cam_y += -11;
              cam_z += -14;
          this.shapes.ball.draw(graphics_state,
          m.times(Mat4.translation(Vec.of(apple_x + 82.8, 4.3, 9))).times(Mat4.scale(Vec.of(2.5, 4, 1))),
          this.shape_materials.cocoon|| this.plastic
          );
        }

        if(t >=80.5 && t < 81.5){
              cam_x += -79;
              cam_y += -11;
              cam_z += -14;
          this.shapes.ball.draw(graphics_state,
          m.times(Mat4.translation(Vec.of(apple_x + 82.8, 4.3, 9))).times(Mat4.scale(Vec.of(2.5, 4, 1))),
          this.shape_materials.cocoon|| this.plastic
          );
           this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 84, 5.75, 10))).times(Mat4.scale(Vec.of(0.1 * 2,1.75,0.05 * 2))).times(Mat4.rotation(1.7, Vec.of(0, 1.2, -0.1))),
                this.texture_black|| this.plastic
            );
           this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 82.62,3.15, 10))).times(Mat4.rotation(1, Vec.of(0, 0, -1))).times(Mat4.scale(Vec.of(0.25,1.75,0.05))),
                this.texture_black|| this.plastic
            );
             this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 81.9,1.7, 10))).times(Mat4.rotation(1, Vec.of(0, 0, 1))).times(Mat4.scale(Vec.of(0.25,1.1,0.05))),
                this.texture_black|| this.plastic
            );
        }

        if(t >= 81.5){// && t < 82.5){
            
            cam_x += -79;
            cam_y += -11;
            cam_z += -14;
            if(t <= 82.5){
            this.shapes.watermelon.draw(graphics_state,
            m.times(Mat4.translation(Vec.of(apple_x + 82.8, 4.3, 9))).times(Mat4.scale(Vec.of(3.5, 4, 1))).times(Mat4.rotation(1, Vec.of(0, 0, 1))),
            this.shape_materials.cocoon|| this.plastic
            ); 
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + 82.75,4.55, 10))).times(Mat4.rotation(0.5, Vec.of(0, 0, -1))).times(Mat4.scale(Vec.of(0.25,3.62,0.05))),
                this.texture_black|| this.plastic
            );
            }
            if(t > 82.5){
                // cam_x += -10;
                // cam_y += -5;
                 m = m.times(Mat4.translation(Vec.of(apple_x + 84.8, 6.3, 9))).times(Mat4.scale(0.1)); 
                 this.shapes.cube.draw(
                 graphics_state,
                 m.times(Mat4.translation(Vec.of(0, -20, 0))).times(Mat4.rotation(1, Vec.of(0, 1, 0))).times(Mat4.scale(Vec.of(2.5, 15, 2.5))),
                this.texture_skyBlue || this.plastic);
                //this creates the head
                 this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(-0.25 , 0 , 1)))/*.times(Mat4.rotation(t, Vec.of(0, 1, 0)))*/.times(Mat4.scale(5)),
                this.texture_skyBlue || this.plastic);  
                 this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(-0.25 ,-41, 2)))/*.times(Mat4.rotation(t, Vec.of(0, 1, 0)))*/.times(Mat4.scale(Vec.of(2.5, 7, 2.5))),
                this.texture_skyBlue || this.plastic);  
                this.draw_wing1(graphics_state, m);
                this.draw_wing2(graphics_state, m);
                this.draw_leg(graphics_state, m , 0, -10, 3.63, -10);
                this.draw_leg(graphics_state, m , 0, -20, 3.63, -20);
                this.draw_leg(graphics_state, m , 0, -30, 3.63, -30);
                this.draw_leg(graphics_state, m , 1, -10, -3.63, -10);
                this.draw_leg(graphics_state, m , 1, -20, -3.63, -20);
                this.draw_leg(graphics_state, m , 1, -30, -3.63, -30);
                this.draw_grass(graphics_state, m /*=Mat4.translation(Vec.of(1.75, 5.25, 1.75)).times(Mat4.rotation(-0.2, Vec.of(0, 0, 1)))*/, 0);
                this.draw_grass(graphics_state, m /*= Mat4.translation(Vec.of(-1.75, 5.25, 1.75)).times(Mat4.rotation(0.2, Vec.of(0, 0, 1)))*/, 1);
            }
        }
        


       

        //draw_caterpillar(graphics_state, m, 1);
        
        
        
        //align camera matrix to apple
        c = c.times(Mat4.translation(Vec.of(cam_x, cam_y, cam_z))).times(Mat4.rotation(Math.PI/8, Vec.of(1,0,0)));
        
         if (t <= 7) {
        c = Mat4.look_at(Vec.of(-10,3, 15), Vec.of(apple_x,apple_y,apple_z), Vec.of(0,1,0)).times(Mat4.rotation(Math.PI/8, Vec.of(1,0,0)));
    }

        //DRAW SKY SPHERE

        this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(-cam_x, -cam_y, -cam_z))).times(Mat4.scale(Vec.of(1000,1000,1000))),
                this.shape_materials.sky || this.plastic);
        //move camera
        graphics_state.camera_transform = c;
    }

    draw_caterpillar(graphics_state, m, apple_x, x, time1, time2, t, scale){

         if(time1 <= t && t < time2 ){
          this.draw_antennae(graphics_state, m.times(Mat4.translation(Vec.of(apple_x + (1.5*x) + 8 + scale, -10.1, 7))), 1, scale );
          this.draw_antennae(graphics_state, m.times(Mat4.translation(Vec.of(apple_x + (1.5*x) + 8 + scale, -10.1, 7))), -1, scale );
          /*this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + (1.51*x) + 7.8, -9.45 + (0.25 * scale), 7))).times(Mat4.scale(Vec.of(0.1 + (0.25 * scale),0.3 + (2 * scale),0.05))).times(Mat4.rotation(1.2 + 0.5*scale, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );
            this.shapes.stem.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + (1.52*x) + 8.3, -9.45 + (0.25 * scale), 7))).times(Mat4.scale(Vec.of(0.1 + (0.25 * scale),0.3 + (2 * scale),0.05 ))).times(Mat4.rotation(-1.2 - 0.5*scale, Vec.of(0, 0, -0.5))),
                this.texture_skyBlue|| this.plastic
            );*/
       // let m_eyes = m.times(Mat4.translation(Vec.of(apple_x + (1.5*x) + 8 + scale, -10.1, 7)));
        this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + (1.5*x) + 8 + scale, -10.1, 7))).times(Mat4.scale(0.5 + scale)),
                this.texture_purple || this.plastic);
        this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + (1.5*x) + 7.1 - scale, -10.3 - (scale*0.2), 7))).times(Mat4.scale(0.5 + scale)),
                this.texture_yellow  || this.plastic);
        this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + (1.5*x) + 6.2 - 3*scale, -10.1, 7))).times(Mat4.scale(0.5 + scale)),
                this.texture_purple || this.plastic);
        this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x +(1.5*x) + 5.3 - 5*scale, -10.3- (scale*0.2), 7))).times(Mat4.scale(0.5 + scale)),
                this.texture_yellow || this.plastic); 
        this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + (1.5*x) + 4.4 - 7*scale, -10.1, 7))).times(Mat4.scale(0.5 + scale)),
                this.texture_purple || this.plastic);
        this.shapes.ball.draw(
                graphics_state,
                m.times(Mat4.translation(Vec.of(apple_x + (1.5*x) + 3.45 - 9*scale, -10.3- (scale*0.2), 7))).times(Mat4.scale(0.5 + scale)),
                this.texture_yellow || this.plastic); 
         }
    }

  /*  draw_eyes(graphics_state, m, flag){
            if( flag == 1){
              this.shapes.circle.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(-0.2, 0.75, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);  
            }
            else{
                this.shapes.circle.draw(graphics_state,
                m.times(Mat4.translation(Vec.of(0.1, 0.75, 2))).times(Mat4.scale(0.08)),
                this.texture_black || this.plastic);    
            }
    }*/

     draw_grass(graphics_state, m , variety){
     if(variety == 0){
        var deg = 0.2 * Math.sin(this.t);
        m = m.times(Mat4.translation(Vec.of(1.75, 5.25, 1.75)).times(Mat4.rotation(-0.2, Vec.of(0, 0, 1))).times(Mat4.rotation(-0.25, Vec.of(-1, 0, 0))));
       /* if(!this.hover){
            m = m
                .times(Mat4.translation(Vec.of(20*Math.cos(this.t), 20*Math.sin(this.t), 0)))
                .times(Mat4.rotation((this.t), Vec.of(0, 0, 1)))
                .times(Mat4.translation(Vec.of(0, 0, 5*Math.sin(5 * this.t))))
                .times(Mat4.translation(Vec.of(0, 0, 40)));
        }*/
     }
     else{
        var deg = -0.2 * Math.sin(this.t);
        m = m.times(Mat4.translation(Vec.of(-1.75, 5.25, 1.75)).times(Mat4.rotation(0.2, Vec.of(0, 0, 1))).times(Mat4.rotation(0.25, Vec.of(1, 0, 0))));
     }
     this.shapes.box.draw(
            graphics_state,
            m,
            this.texture_yellow || this.plastic);
     for(var i = 0; i < 9; ++i){
         let sign = (deg >= 0) ? -1 : 1;
          m = m.times(Mat4.translation(Vec.of(-1 * sign, 1.05 , 0)))
            .times(Mat4.rotation(0.3 * deg, Vec.of(-1, 0, 0)))
            .times(Mat4.translation(Vec.of(sign, 1, 0)));
         this.shapes.box.draw(
            graphics_state,
            m,
            this.texture_yellow || this.texture_skyBlue);  
     }
      this.shapes.ball.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0 , 3 , 0))).times(Mat4.scale(2)),
            this.texture_purple);
  }

  draw_antennae(graphics_state, m, n, scale){
          let m_stem = m;
          if(n == 1){
          this.shapes.stem.draw(
                graphics_state, 
                m_stem.times(Mat4.translation(Vec.of(-0.25 - (0.1*scale), 0.6 + (scale*0.85), 0))).times(Mat4.scale(Vec.of(0.1 + (0.1*scale), 0.5 + (scale*0.75), 0.1))),
                this.texture_skyBlue || this.plastic
          );
          let m_ball = m_stem.times(Mat4.translation(Vec.of(-0.25 - (0.1*scale),0.6 + (scale*0.85), 0 )));
          this.shapes.ball.draw(
                graphics_state,
                m_ball.times(Mat4.translation(Vec.of(0, 0.7 + (0.35*scale), 0))).times(Mat4.scale(Vec.of(0.2 + (scale * 0.1), 0.2 + (scale * 0.1), 0.2))),
                this.texture_purple || this.plastic
          );
          }
          else{
               this.shapes.stem.draw(
                graphics_state, 
                m_stem.times(Mat4.translation(Vec.of(0.25 + (0.1*scale), 0.6 + (scale*0.85), 0))).times(Mat4.scale(Vec.of(0.1 + (0.1*scale), 0.5 + (scale*0.75), 0.1))),
                this.texture_skyBlue || this.plastic
          );  
          let m_ball =   m_stem.times(Mat4.translation(Vec.of(0.25 + (0.1*scale), 0.6 + (scale*0.85), 0)));
          this.shapes.ball.draw(
                graphics_state,
                m_ball.times(Mat4.translation(Vec.of(0, 0.7 + (0.35*scale), 0))).times(Mat4.scale(Vec.of(0.2 + (scale * 0.1), 0.2 + (scale * 0.1), 0.2))),
                this.texture_purple || this.plastic
          );
          }


  }

  draw_leg(graphics_state, m , variety, n, x, y){
       //m = Mat4.translation(Vec.of(3.63, -10, -3.2)).times(Mat4.rotation(0.241, Vec.of(0, -0.5, 0)));
      
      if(x == 3.63)
         m = m.times(Mat4.translation(Vec.of(x-0.1, y, -3.2)).times(Mat4.rotation(0.241, Vec.of(0, -0.5, 0))));
      else
         m = m.times(Mat4.translation(Vec.of(x-0.08, y, -3.2))/*.times(Mat4.rotation(0.1, Vec.of(0, 1, 0)))*/);
      if(variety == 0)
         var deg = 0.2 * Math.sin(this.t);
      else
         var deg = -0.2 * Math.sin(this.t);
      //if (variety == 0)
      //let sign = (deg <= 0) ? -0.05 : 0.15;
      if(variety == 0){
          if(deg <= 0)
            var sign = -0.25;
          else
            var sign = -0.35;
      }
      else{
        if(deg <= 0)
            var sign = -0.05;
          else
            var sign = -0.07;
      }
      m = m.times(Mat4.rotation( 0.06 * Math.sin(this.t), Vec.of(0, 1, 0)));
      this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.rotation(0.241, Vec.of(0, 0.5, 0))).times(Mat4.scale(Vec.of(1, 1, 4))).times(Mat4.translation(Vec.of(0, 0, -0.75))),
            this.texture_purple || this.plastic);
      if(variety == 0){
         m = m.times(Mat4.translation(Vec.of(-1.1, 0.25 , -4.36))
            .times(Mat4.rotation(0.481, Vec.of(0, 0.5, 0)))
           .times(Mat4.translation(Vec.of(0.9, -0.11, -3.58))).times(Mat4.scale(Vec.of(1, 1, 4))).times(Mat4.translation(Vec.of(-0.25, -0.1, -0.77))));
      }
      else{
           m = m.times(Mat4.translation(Vec.of(0, 0 , -1))
            .times(Mat4.rotation(0.241, Vec.of(0, -0.25, 0)))
           .times(Mat4.translation(Vec.of(-3.3, 0.1, -6.62))).times(Mat4.scale(Vec.of(1, 1, 4))).times(Mat4.translation(Vec.of(0.25, -0.1, -0.77))));
      }
      this.shapes.box.draw(
          graphics_state,
          m,
          this.texture_yellow || this.plastic);
      }

  draw_wing1(graphics_state, m){
      m = m.times(Mat4.translation(Vec.of(3.25, -20, 2.75))).times(Mat4.rotation(0.5 * Math.sin(this.t), Vec.of(0, 1, 0)));
      
      //draw prism, use the same rotation, translate it different from before, scale it same as before
      this.shapes.prism.draw(
           graphics_state, m.times(Mat4.rotation(2.356, Vec.of(0, 0, 1))).times(Mat4.translation(Vec.of(-10.085, -10.085, 0))).times(Mat4.scale(Vec.of(21.25, 21.25, 0.25))),
            this.texture_purple || this.plastic
         );

      //draw box, rotation, translation, scale
     this.shapes.cube.draw(
            graphics_state,
            m.times(Mat4.rotation(0.785, Vec.of(0, 0, 1))).times(Mat4.translation(Vec.of(-0.5, -20.8, 0))).times(Mat4.scale(Vec.of(10.61, 10.61, 0.25))),
            this.shape_materials.caterpillerYello || this.plastic); 

      //draw other box, rotation, translation, scale
      this.shapes.cube.draw(
            graphics_state,
            m.times(Mat4.rotation(0.785, Vec.of(0, 0, -1))).times(Mat4.translation(Vec.of(3.5, 24.73, 0))).times(Mat4.scale(Vec.of(14.63, 14.63, 0.25))),
            this.shape_materials.caterpillerYello|| this.plastic);
      //.translation(Vec.of(23.175, -5, 2.75)))
  }
  draw_wing2(graphics_state, m){
      m = m.times(Mat4.translation(Vec.of(-3.25, -20, 2.75))).times(Mat4.rotation(-0.5 * Math.sin(this.t), Vec.of(0, 1, 0)));
     
      this.shapes.prism.draw(
           graphics_state, m.times(Mat4.rotation(5.495, Vec.of(0, 0, 1))).times(Mat4.translation(Vec.of(-10.085, -10.085, 0))).times(Mat4.scale(Vec.of(21.25, 21.25, 0.25))),
            this.texture_purple || this.plastic
         );

      //draw box, rotation, translation, scale
     this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.rotation(0.785, Vec.of(0, 0, -1))).times(Mat4.translation(Vec.of(0.5, -20.8, 0))).times(Mat4.scale(Vec.of(10.61, 10.61, 0.25))),
            this.shape_materials.caterpillerYello || this.plastic); 

      //draw other box, rotation, translation, scale
    this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.rotation(0.785, Vec.of(0, 0, -1))).times(Mat4.translation(Vec.of(-24.73, -3.5, 0))).times(Mat4.scale(Vec.of(14.63, 14.63, 0.25))),
            this.shape_materials.caterpillerYello || this.plastic);
  }
}

window.Assignment_Two_Skeleton = window.classes.Assignment_Two_Skeleton = Assignment_Two_Skeleton;
