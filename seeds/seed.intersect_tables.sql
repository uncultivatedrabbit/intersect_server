BEGIN;

TRUNCATE
  intersect_users,
  intersect_projects,
  intersect_project_comments
  RESTART IDENTITY CASCADE;

INSERT INTO intersect_users (email, full_name, password)
VALUES 
('brandonmelendezdev@gmail.com', 'brandon melendez', '$2a$12$L70yPQhupZnCNfMoojTJy.PcGEUvxsI0Fm1O1DV1BHbPTcOFMYAoO'),
('testing@gmail.com', 'Angela Frankel', '$2a$12$L70yPQhupZnCNfMoojTJy.PcGEUvxsI0Fm1O1DV1BHbPTcOFMYAoO'),
('a@gmail.com', 'Alex Terrible', '$2a$12$L70yPQhupZnCNfMoojTJy.PcGEUvxsI0Fm1O1DV1BHbPTcOFMYAoO'),
('b@gmail.com', 'Tom Delonge', '$2a$12$L70yPQhupZnCNfMoojTJy.PcGEUvxsI0Fm1O1DV1BHbPTcOFMYAoO'),
('c@gmail.com', 'Mark Hoppus', '$2a$12$L70yPQhupZnCNfMoojTJy.PcGEUvxsI0Fm1O1DV1BHbPTcOFMYAoO'),
('d@gmail.com', 'Travis Barker', '$2a$12$L70yPQhupZnCNfMoojTJy.PcGEUvxsI0Fm1O1DV1BHbPTcOFMYAoO'),
('e@gmail.com', 'Brendan Urie', '$2a$12$L70yPQhupZnCNfMoojTJy.PcGEUvxsI0Fm1O1DV1BHbPTcOFMYAoO'),
('f@gmail.com', 'Pete Wentz', '$2a$12$L70yPQhupZnCNfMoojTJy.PcGEUvxsI0Fm1O1DV1BHbPTcOFMYAoO'),
('g@gmail.com', 'Homer Simpson', '$2a$12$L70yPQhupZnCNfMoojTJy.PcGEUvxsI0Fm1O1DV1BHbPTcOFMYAoO');

INSERT INTO intersect_projects (title, summary, medical_specialty, medical_subspecialty, irbstatus, support_needed, owner_id) 
VALUES 
('Why Medicine Is Important', 'Medicine keeps people alive, and alive is good, thus medicine should be understood as important', 'Dermatology', 'Pediatric Dermatology', 'accepted', 'I need someone who can help people understand that medicine is important', 1), 
('A Fever You Cant Sweat Out', 'Sit tight, Im gonna need you to keep time. Come on just snap, snap, snap your fingers for me. Good, good now were making some progress. Come on just tap, tap, tap your toes to the beat. And I believe this may call for a proper introduction, and well, Dont you see, Im the narrator, and this is just the prologue?', 'Surgery', 'Neonatal Surgery', 'exempt', 'I need someone who can help people understand that medicine is important', 2),
('Whats My Age Again?', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget est lorem ipsum dolor sit amet consectetur adipiscing elit. Malesuada nunc vel risus commodo viverra maecenas. Sed ullamcorper morbi tincidunt ornare massa eget egestas purus. Ut ornare lectus sit amet est placerat in egestas erat. Tempus egestas sed sed risus pretium quam vulputate. Non enim praesent elementum facilisis leo vel. Nec sagittis aliquam malesuada bibendum arcu vitae. Orci phasellus egestas tellus rutrum tellus pellentesque. Sit amet cursus sit amet dictum sit amet. Egestas congue quisque egestas diam in arcu. Est lorem ipsum dolor sit amet.', 'Allergy and Immunology', null, 'submitted', 'I need someone who can help people understand that medicine is important', 2),
('Stay Together For The Kids', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget est lorem ipsum dolor sit amet consectetur adipiscing elit. Malesuada nunc vel risus commodo viverra maecenas. Sed ullamcorper morbi tincidunt ornare massa eget egestas purus. Ut ornare lectus sit amet est placerat in egestas erat. Tempus egestas sed sed risus pretium quam vulputate. Non enim praesent elementum facilisis leo vel. Nec sagittis aliquam malesuada bibendum arcu vitae. Orci phasellus egestas tellus rutrum tellus pellentesque. Sit amet cursus sit amet dictum sit amet. Egestas congue quisque egestas diam in arcu. Est lorem ipsum dolor sit amet.', 'Emergency Medicine', 'Critical Care Medicine', 'accepted', 'I need someone who can help people understand that medicine is important', 3),
('I Got 10 Friends And A Crowbar That Say You Aint Gonna Do Jack', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget est lorem ipsum dolor sit amet consectetur adipiscing elit. Malesuada nunc vel risus commodo viverra maecenas. Sed ullamcorper morbi tincidunt ornare massa eget egestas purus. Ut ornare lectus sit amet est placerat in egestas erat. Tempus egestas sed sed risus pretium quam vulputate. Non enim praesent elementum facilisis leo vel. Nec sagittis aliquam malesuada bibendum arcu vitae. Orci phasellus egestas tellus rutrum tellus pellentesque. Sit amet cursus sit amet dictum sit amet. Egestas congue quisque egestas diam in arcu. Est lorem ipsum dolor sit amet.', 'Internal Medicine', 'Advanced Heart Failure and Transplant Cardiology', 'accepted', 'I need someone who can help people understand that medicine is important', 4);

INSERT INTO intersect_project_comments (text, project_id, owner_id, parent_comment_id)
VALUES 
('Hey I love your project, would love to talk more about it', 1, 2, null),
('Awesome, lets talk more my number is 554-9182', 1,1,1),
('This project has a lot of good momentum, lets talk', 3, 5, null),
('This project has a lot of good momentum, lets talk!!!!!', 4, 6, null),
('Thanks! I thought so too, good momentum indeed', 4, 3, 4),
('This project has a lot of good momentum, lets talk', 5, 7, null),
('This project has a lot of good momentum, lets talk', 1, 3, null);

COMMIT;