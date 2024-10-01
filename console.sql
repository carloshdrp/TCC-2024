create table if not exists genius.Achievement
(
    id          varchar(191)                             not null
        primary key,
    title       varchar(191)                             not null,
    description varchar(191)                             not null,
    `condition` varchar(191)                             not null,
    imagePath   varchar(191)                             not null,
    createdAt   datetime(3) default CURRENT_TIMESTAMP(3) not null,
    updatedAt   datetime(3)                              not null
);

create table if not exists genius.Notification
(
    id          varchar(191)                             not null
        primary key,
    recipientId varchar(191)                             not null,
    content     varchar(191)                             not null,
    category    varchar(191)                             not null,
    resourceId  varchar(191)                             null,
    readAt      datetime(3)                              null,
    createdAt   datetime(3) default CURRENT_TIMESTAMP(3) not null
);

create index Notification_recipientId_idx
    on genius.Notification (recipientId);

create table if not exists genius.User
(
    id              varchar(191)                                                                             not null
        primary key,
    email           varchar(255)                                                                             not null,
    name            varchar(191)                                                                             not null,
    password        varchar(191)                                                                             not null,
    role            enum ('ADMIN', 'ESTUDIOSO', 'INICIANTE')                    default 'INICIANTE'          not null,
    avatar          varchar(191)                                                                             null,
    createdAt       datetime(3)                                                 default CURRENT_TIMESTAMP(3) not null,
    lastProfileEdit datetime(3)                                                 default CURRENT_TIMESTAMP(3) not null,
    updatedAt       datetime(3)                                                                              not null,
    points          int                                                         default 0                    not null,
    league          enum ('Topaz', 'Rubi', 'Esmeralda', 'Ametista', 'Diamante') default 'Topaz'              not null,
    constraint User_email_key
        unique (email)
);

create table if not exists genius.Question
(
    id          varchar(191)                             not null
        primary key,
    title       varchar(191)                             not null,
    description text                                     not null,
    tag         varchar(191)                             not null,
    locked      tinyint(1)  default 0                    not null,
    createdAt   datetime(3) default CURRENT_TIMESTAMP(3) not null,
    updatedAt   datetime(3)                              not null,
    userId      varchar(191)                             not null,
    constraint Question_userId_fkey
        foreign key (userId) references genius.User (id)
            on update cascade
);

create table if not exists genius.Answer
(
    id          varchar(191)                             not null
        primary key,
    description text                                     not null,
    createdAt   datetime(3) default CURRENT_TIMESTAMP(3) not null,
    updatedAt   datetime(3)                              not null,
    userId      varchar(191)                             not null,
    questionId  varchar(191)                             not null,
    constraint Answer_questionId_fkey
        foreign key (questionId) references genius.Question (id)
            on update cascade,
    constraint Answer_userId_fkey
        foreign key (userId) references genius.User (id)
            on update cascade
);

create table if not exists genius.Quiz
(
    id          varchar(191)                                                                                                                                                           not null
        primary key,
    title       varchar(191)                                                                                                                                                           not null,
    description text                                                                                                                                                                   not null,
    subject     enum ('MATEMATICA', 'PORTUGUES', 'HISTORIA', 'GEOGRAFIA', 'BIOLOGIA', 'QUIMICA', 'FISICA', 'SOCIOLOGIA', 'FILOSOFIA', 'INGLES', 'ESPANHOL', 'ARTE', 'EDUCACAO_FISICA') not null,
    createdAt   datetime(3) default CURRENT_TIMESTAMP(3)                                                                                                                               not null,
    updatedAt   datetime(3)                                                                                                                                                            not null,
    userId      varchar(191)                                                                                                                                                           not null,
    constraint Quiz_userId_fkey
        foreign key (userId) references genius.User (id)
            on update cascade
);

create table if not exists genius.QuizAttempt
(
    id        varchar(191)                             not null
        primary key,
    quizId    varchar(191)                             not null,
    userId    varchar(191)                             not null,
    score     int                                      null,
    createdAt datetime(3) default CURRENT_TIMESTAMP(3) not null,
    constraint QuizAttempt_quizId_fkey
        foreign key (quizId) references genius.Quiz (id)
            on update cascade,
    constraint QuizAttempt_userId_fkey
        foreign key (userId) references genius.User (id)
            on update cascade
);

create table if not exists genius.Rating
(
    id           varchar(191)                             not null
        primary key,
    createdAt    datetime(3) default CURRENT_TIMESTAMP(3) not null,
    updatedAt    datetime(3)                              not null,
    userId       varchar(191)                             not null,
    rateableId   varchar(191)                             not null,
    rateableType enum ('QUESTION', 'ANSWER', 'QUIZ')      not null,
    constraint Rating_userId_fkey
        foreign key (userId) references genius.User (id)
            on update cascade
);

create index Rating_rateableId_rateableType_idx
    on genius.Rating (rateableId, rateableType);

create table if not exists genius.Report
(
    id             varchar(191)                                                          not null
        primary key,
    createdAt      datetime(3)                              default CURRENT_TIMESTAMP(3) not null,
    updatedAt      datetime(3)                                                           not null,
    userId         varchar(191)                                                          not null,
    reason         enum ('SPAM', 'INAPROPRIADO', 'OFENSIVO', 'LINKS', 'OUTRO')           not null,
    description    varchar(191)                                                          null,
    status         enum ('PENDING', 'ACCEPTED', 'REJECTED') default 'PENDING'            not null,
    message        varchar(191)                                                          null,
    reportableId   varchar(191)                                                          not null,
    reportableType enum ('QUESTION', 'ANSWER', 'QUIZ')                                   not null,
    constraint Report_userId_fkey
        foreign key (userId) references genius.User (id)
            on update cascade
);

create index Report_reportableId_reportableType_idx
    on genius.Report (reportableId, reportableType);

create table if not exists genius.Token
(
    id          varchar(191)                                                 not null
        primary key,
    token       text                                                         not null,
    type        enum ('ACCESS', 'REFRESH', 'RESET_PASSWORD', 'VERIFY_EMAIL') not null,
    expires     datetime(3)                                                  not null,
    blackListed tinyint(1)  default 0                                        not null,
    createdAt   datetime(3) default CURRENT_TIMESTAMP(3)                     not null,
    updatedAt   datetime(3)                                                  not null,
    userId      varchar(191)                                                 not null,
    constraint Token_token_key
        unique (token(255)),
    constraint Token_userId_fkey
        foreign key (userId) references genius.User (id)
            on update cascade on delete cascade
);

create index Token_userId_idx
    on genius.Token (userId);

create table if not exists genius.UserAchievements
(
    id            varchar(191)                             not null
        primary key,
    userId        varchar(191)                             not null,
    achievementId varchar(191)                             not null,
    unlockedAt    datetime(3) default CURRENT_TIMESTAMP(3) not null,
    constraint UserAchievements_userId_achievementId_key
        unique (userId, achievementId),
    constraint UserAchievements_achievementId_fkey
        foreign key (achievementId) references genius.Achievement (id)
            on update cascade,
    constraint UserAchievements_userId_fkey
        foreign key (userId) references genius.User (id)
            on update cascade
);

create table if not exists genius.quizQuestion
(
    id          varchar(191) not null
        primary key,
    description text         not null,
    correct     varchar(191) not null,
    wrong1      varchar(191) not null,
    wrong2      varchar(191) not null,
    wrong3      varchar(191) not null,
    wrong4      varchar(191) not null,
    quizId      varchar(191) not null,
    constraint quizQuestion_quizId_fkey
        foreign key (quizId) references genius.Quiz (id)
            on update cascade
);

create table if not exists genius.QuizQuestionAnswer
(
    id             varchar(191)                                             not null
        primary key,
    choice         enum ('correct', 'wrong1', 'wrong2', 'wrong3', 'wrong4') not null,
    quizQuestionId varchar(191)                                             not null,
    userId         varchar(191)                                             not null,
    quizAttemptId  varchar(191)                                             not null,
    constraint QuizQuestionAnswer_quizAttemptId_fkey
        foreign key (quizAttemptId) references genius.QuizAttempt (id)
            on update cascade,
    constraint QuizQuestionAnswer_quizQuestionId_fkey
        foreign key (quizQuestionId) references genius.quizQuestion (id)
            on update cascade,
    constraint QuizQuestionAnswer_userId_fkey
        foreign key (userId) references genius.User (id)
            on update cascade
);

create table if not exists genius.quizRelation
(
    id        varchar(191)         not null
        primary key,
    quizId    varchar(191)         not null,
    userId    varchar(191)         not null,
    completed tinyint(1) default 0 not null,
    constraint quizRelation_quizId_userId_key
        unique (quizId, userId),
    constraint quizRelation_quizId_fkey
        foreign key (quizId) references genius.Quiz (id)
            on update cascade,
    constraint quizRelation_userId_fkey
        foreign key (userId) references genius.User (id)
            on update cascade
);

