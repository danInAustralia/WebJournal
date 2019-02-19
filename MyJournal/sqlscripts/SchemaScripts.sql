alter table Resource
add Uploaded datetime;

/*add new table ResourceOwner because more than one person can upload and own the same file*/

create Table [dbo].ResourceOwner(
	[ResourceOwnerID] [int] IDENTITY(1,1) NOT NULL,
	[ResourceID] [nvarchar](50) NOT NULL,
	[OwnerID] [nvarchar](128) NOT NULL,
CONSTRAINT [PK_ResourceOwner] PRIMARY KEY CLUSTERED 
(
	[ResourceOwnerID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].ResourceOwner  WITH CHECK ADD  CONSTRAINT [FK_ResourceOwner_User] FOREIGN KEY([OwnerID])
REFERENCES [dbo].[AspNetUsers] ([Id])
GO

ALTER TABLE [dbo].ResourceOwner  WITH CHECK ADD  CONSTRAINT [FK_ResourceOwner_Resource] FOREIGN KEY([ResourceID])
REFERENCES [dbo].[Resource] ([HashID])
GO

insert into ResourceOwner(ResourceID, OwnerID)
SELECT        Album_X_Resource.ResourceID, Album.OwnerID
FROM            Album INNER JOIN
                         Album_X_Resource ON Album.AlbumID = Album_X_Resource.AlbumID