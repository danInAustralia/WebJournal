using MyJournal.ViewModels;
using Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResourceModel;

namespace MyJournal.Factories
{
    public class AlbumListViewModelFactory
    {

        public AlbumListViewModel GetAlbumListViewModel(IResourceRepository repository, String userName)
        {
            AlbumListViewModel vm = new AlbumListViewModel
            {
                Albums = MapAlbumsToVM(repository.GetAlbums(x => x.Owner.UserName == userName)),
                NewAlbum = new ResourceModel.Album
                {
                    Name = "New Album",
                    Description = "New Album description...",
                    AlbumDate = DateTime.Today,
                    Resources = new List<ResourceModel.DigitalResource>()
                }
            };
            return vm;
        }

        /// <summary>
        /// Convert list of Albums to album viewmodels. Better to use AutoMapper for this
        /// but I'm too lazy
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        private List<AlbumViewModel> MapAlbumsToVM(List<Album> list)
        {
            List<AlbumViewModel> albumVMs = new List<AlbumViewModel>();

            foreach(Album album in list)
            {
                AlbumViewModel avm = new AlbumViewModel
                {
                    ID = album.ID,
                    Name = album.Name,
                    Description = album.Description,
                    AlbumDate = album.AlbumDate,
                    Owner = album.Owner
                };
                albumVMs.Add(avm);
            }

            return albumVMs;
        }
    }
}